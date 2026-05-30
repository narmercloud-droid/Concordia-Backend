import pathlib, re, json
root = pathlib.Path('migrations')
state = {}
enums = {}
indexes = {}

def clean_line(line):
    if '--' in line:
        return line.split('--', 1)[0]
    return line

for path in sorted(root.glob('**/migration.sql')):
    text = path.read_text(encoding='utf8')
    lines = [clean_line(line).rstrip() for line in text.splitlines()]
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue
        if line.upper().startswith('CREATE TYPE'):
            buf = line
            while ';' not in buf:
                i += 1
                buf += ' ' + clean_line(lines[i]).strip()
            m = re.search(r'CREATE TYPE "([^"]+)" AS ENUM \((.*)\)', buf, re.I)
            if m:
                enums[m.group(1)] = [v.strip().strip("'") for v in m.group(2).split(',')]
        elif line.upper().startswith('CREATE TABLE'):
            m = re.match(r'CREATE TABLE "([^"]+)" \(', line, re.I)
            if not m:
                i += 1
                continue
            name = m.group(1)
            body_lines = []
            i += 1
            depth = 1
            while i < len(lines):
                l = lines[i]
                if ')' in l and l.strip().endswith(');'):
                    body_lines.append(l[:l.rfind(')')])
                    break
                body_lines.append(l)
                i += 1
            cols = []
            pk = []
            for l in body_lines:
                s = l.strip().rstrip(',')
                if not s:
                    continue
                if s.upper().startswith('CONSTRAINT'):
                    if 'PRIMARY KEY' in s.upper():
                        pm = re.search(r'PRIMARY KEY \(([^\)]+)\)', s, re.I)
                        if pm:
                            pk = [c.strip().strip('"') for c in pm.group(1).split(',')]
                    continue
                cols.append(s)
            state[name] = {'columns': {}, 'pk': pk, 'fks': [], 'indexes': []}
            for col in cols:
                if col.startswith('"'):
                    parts = col.split(None, 2)
                    colname = parts[0].strip('"')
                    coltype = parts[1]
                    state[name]['columns'][colname] = {'type': coltype, 'raw': col, 'notnull': 'NOT NULL' in col.upper(), 'default': None, 'unique': False, 'autoincrement': 'SERIAL' in coltype.upper()}
                    if 'DEFAULT' in col.upper():
                        dm = re.search(r'DEFAULT (.+)', col, re.I)
                        if dm:
                            state[name]['columns'][colname]['default'] = dm.group(1).strip()
        elif line.upper().startswith('DROP TABLE'):
            m = re.search(r'DROP TABLE "([^"]+)"', line, re.I)
            if m:
                state.pop(m.group(1), None)
        elif line.upper().startswith('ALTER TABLE'):
            buf = line
            while ';' not in buf and i + 1 < len(lines):
                i += 1
                buf += ' ' + clean_line(lines[i]).strip()
            m = re.match(r'ALTER TABLE "([^"]+)" (.+);?$', buf, re.I)
            if not m:
                i += 1
                continue
            table = m.group(1)
            body = m.group(2).strip()
            if body.upper().startswith('ADD COLUMN'):
                add = body[len('ADD COLUMN'):].strip()
                parts = re.split(r',\s*(?="|$)', add)
                for fragment in parts:
                    fragment = fragment.strip().rstrip(',')
                    if not fragment:
                        continue
                    if fragment.upper().startswith('ADD COLUMN'):
                        fragment = fragment[len('ADD COLUMN'):].strip()
                    cols = fragment.split(None, 2)
                    if len(cols) < 2:
                        continue
                    colname = cols[0].strip('"')
                    coltype = cols[1]
                    state.setdefault(table, {'columns': {}, 'pk': [], 'fks': [], 'indexes': []})['columns'][colname] = {'type': coltype, 'raw': fragment, 'notnull': 'NOT NULL' in fragment.upper(), 'default': None, 'unique': False, 'autoincrement': 'SERIAL' in coltype.upper()}
                    if 'DEFAULT' in fragment.upper():
                        dm = re.search(r'DEFAULT ([^,]+)', fragment, re.I)
                        if dm:
                            state[table]['columns'][colname]['default'] = dm.group(1).strip()
            elif 'DROP COLUMN' in body.upper():
                for col in re.findall(r'DROP COLUMN "([^"]+)"', body, re.I):
                    if table in state and col in state[table]['columns']:
                        del state[table]['columns'][col]
            elif 'ADD CONSTRAINT' in body.upper() and 'FOREIGN KEY' in body.upper():
                fk = re.search(r'FOREIGN KEY \("([^"]+)"\) REFERENCES "([^"]+)"\("([^"]+)"\)(?: ON DELETE ([A-Z_]+))?(?: ON UPDATE ([A-Z_]+))?', body, re.I)
                if fk:
                    state.setdefault(table, {'columns': {}, 'pk': [], 'fks': [], 'indexes': []})['fks'].append({'column': fk.group(1), 'ref_table': fk.group(2), 'ref_column': fk.group(3), 'on_delete': fk.group(4), 'on_update': fk.group(5)})
            elif body.upper().startswith('ALTER COLUMN') or 'SET DATA TYPE' in body.upper():
                colm = re.search(r'ALTER COLUMN "([^"]+)" SET DATA TYPE ([^\s,]+)', body, re.I)
                if colm:
                    col = colm.group(1); typ = colm.group(2)
                    if table in state and col in state[table]['columns']:
                        state[table]['columns'][col]['type'] = typ
            elif 'DROP CONSTRAINT' in body.upper() and 'PRIMARY KEY' in body.upper():
                pass
        elif line.upper().startswith('CREATE UNIQUE INDEX') or line.upper().startswith('CREATE INDEX'):
            m = re.search(r'CREATE (UNIQUE )?INDEX "([^"]+)" ON "([^"]+)"\(([^\)]+)\)', line, re.I)
            if m:
                unique = bool(m.group(1)); table = m.group(3); cols = [c.strip().strip('"') for c in m.group(4).split(',')]
                for col in cols:
                    indexes.setdefault(table, []).append({'name': m.group(2), 'column': col, 'unique': unique})
        i += 1
for t,v in indexes.items():
    if t in state:
        state[t].setdefault('indexes', []).extend(v)
with open('migration_state_final.json', 'w', encoding='utf8') as f:
    json.dump({'tables': state, 'enums': enums}, f, indent=2)
print('written migration_state_final.json')
