import re, pathlib, json
root = pathlib.Path('migrations')
state = {}
enums = {}
indexes = {}

def statements(text):
    buf = ''
    for line in text.splitlines():
        line = line.split('--', 1)[0]
        if not line.strip():
            continue
        buf += line + '\n'
        if ';' in line:
            parts = buf.split(';')
            for part in parts[:-1]:
                if part.strip():
                    yield part.strip()
            buf = parts[-1]
    if buf.strip():
        yield buf.strip()

for path in sorted(root.glob('**/migration.sql')):
    text = path.read_text(encoding='utf8')
    for stmt in statements(text):
        s = stmt.strip()
        if s.upper().startswith('CREATE TABLE'):
            m = re.search(r'CREATE TABLE "([^"]+)" \((.*)\)\s*$', s, re.S|re.I)
            if not m:
                m2 = re.match(r'CREATE TABLE "([^"]+)" \(', s, re.I)
                if not m2:
                    continue
                name = m2.group(1)
                body = s[s.index('(')+1:]
            else:
                name = m.group(1)
                body = m.group(2)
            cols = []
            pk = []
            for line in body.splitlines():
                line = line.strip().rstrip(',')
                if not line:
                    continue
                if line.upper().startswith('CONSTRAINT'):
                    if 'PRIMARY KEY' in line.upper():
                        p = re.search(r'PRIMARY KEY \(([^\)]+)\)', line, re.I)
                        if p:
                            pk = [c.strip().strip('"') for c in p.group(1).split(',')]
                    continue
                cols.append(line)
            state[name] = {'columns': {}, 'pk': pk, 'fks': [], 'indexes': []}
            for col in cols:
                if col.startswith('"'):
                    parts = col.split(None, 2)
                    colname = parts[0].strip('"')
                    coltype = parts[1]
                    state[name]['columns'][colname] = {
                        'type': coltype,
                        'raw': col,
                        'notnull': 'NOT NULL' in col.upper(),
                        'default': None,
                        'unique': False,
                        'autoincrement': 'SERIAL' in coltype.upper(),
                    }
                    if 'DEFAULT' in col.upper():
                        mdef = re.search(r'DEFAULT (.+)', col, re.I)
                        if mdef:
                            state[name]['columns'][colname]['default'] = mdef.group(1).strip()
        elif s.upper().startswith('CREATE TYPE'):
            m = re.search(r'CREATE TYPE "([^"]+)" AS ENUM \((.*)\)\s*$', s, re.S|re.I)
            if m:
                enums[m.group(1)] = [v.strip().strip("'") for v in m.group(2).split(',')]
        elif s.upper().startswith('CREATE UNIQUE INDEX') or s.upper().startswith('CREATE INDEX'):
            m = re.search(r'CREATE (UNIQUE )?INDEX "([^"]+)" ON "([^"]+)"\("([^"]+)"\)', s, re.I)
            if m:
                unique = bool(m.group(1))
                table = m.group(3)
                col = m.group(4)
                indexes.setdefault(table, []).append({'name': m.group(2), 'column': col, 'unique': unique})
        elif s.upper().startswith('ALTER TABLE'):
            m = re.search(r'ALTER TABLE "([^"]+)" (.+)$', s, re.S|re.I)
            if not m:
                continue
            table = m.group(1)
            body = m.group(2).strip()
            if body.upper().startswith('ADD COLUMN'):
                rest = body[len('ADD COLUMN'):].strip()
                parts = []
                current = ''
                depth = 0
                for ch in rest:
                    if ch == ',' and depth == 0:
                        parts.append(current.strip())
                        current = ''
                    else:
                        if ch == '(':
                            depth += 1
                        elif ch == ')':
                            if depth > 0:
                                depth -= 1
                        current += ch
                if current.strip():
                    parts.append(current.strip())
                for fragment in parts:
                    if not fragment:
                        continue
                    items = fragment.split(None, 2)
                    name = items[0].strip('"')
                    typ = items[1]
                    state.setdefault(table, {'columns': {}, 'pk': [], 'fks': [], 'indexes': []})['columns'][name] = {
                        'type': typ,
                        'raw': fragment,
                        'notnull': 'NOT NULL' in fragment.upper(),
                        'default': None,
                        'unique': False,
                        'autoincrement': 'SERIAL' in typ.upper(),
                    }
                    if 'DEFAULT' in fragment.upper():
                        d = re.search(r'DEFAULT ([^,]+)', fragment, re.I)
                        if d:
                            state[table]['columns'][name]['default'] = d.group(1).strip()
            elif 'DROP COLUMN' in body.upper():
                for col in re.findall(r'DROP COLUMN "([^"]+)"', body, re.I):
                    if table in state and col in state[table]['columns']:
                        del state[table]['columns'][col]
            elif 'ADD CONSTRAINT' in body.upper() and 'FOREIGN KEY' in body.upper():
                m2 = re.search(r'FOREIGN KEY \("([^"]+)"\) REFERENCES "([^"]+)"\("([^"]+)"\)(?: ON DELETE ([A-Z_]+))?(?: ON UPDATE ([A-Z_]+))?', body, re.I)
                if m2:
                    state.setdefault(table, {'columns': {}, 'pk': [], 'fks': [], 'indexes': []})['fks'].append({'column': m2.group(1), 'ref_table': m2.group(2), 'ref_column': m2.group(3), 'on_delete': m2.group(4), 'on_update': m2.group(5)})
        elif s.upper().startswith('DROP TABLE'):
            m = re.search(r'DROP TABLE "([^"]+)"', s, re.I)
            if m and m.group(1) in state:
                del state[m.group(1)]
for table, idxs in indexes.items():
    if table in state:
        state[table].setdefault('indexes', []).extend(idxs)
with open('migration_state.json', 'w', encoding='utf8') as f:
    json.dump({'tables': state, 'enums': enums}, f, indent=2)
