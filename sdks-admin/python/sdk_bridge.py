#!/usr/bin/env python3
import sys
import json
import traceback

def main():
    try:
        raw = sys.stdin.read()
        if not raw:
            print(json.dumps({'error': 'no input'}))
            return
        payload = json.loads(raw)
        operationId = payload.get('operationId')
        params = payload.get('params') or {}
        baseUrl = payload.get('baseUrl')
        token = payload.get('token')

        # try to import the SDK package
        try:
            from concordia_admin_client import ConcordiaAdminClient
        except Exception:
            # try alternative package name
            try:
                import concordia_admin_client as cad
                ConcordiaAdminClient = cad.ConcordiaAdminClient
            except Exception:
                print(json.dumps({'error': 'failed to import concordia_admin_client', 'trace': traceback.format_exc()}))
                return

        # instantiate client
        client = None
        try:
            client = ConcordiaAdminClient(token=token) if token is not None else ConcordiaAdminClient()
        except Exception:
            try:
                client = ConcordiaAdminClient(base_url=baseUrl, token=token) if baseUrl else ConcordiaAdminClient()
            except Exception:
                client = ConcordiaAdminClient()

        # dispatch: support dotted paths like 'admin.login' to reach nested attributes
        def resolve_attr(obj, dotted):
            parts = dotted.split('.') if dotted else []
            cur = obj
            for p in parts:
                if hasattr(cur, p):
                    cur = getattr(cur, p)
                else:
                    return None
            return cur

        method = resolve_attr(client, operationId)
        if method is None:
            print(json.dumps({'error': 'method_not_found', 'operationId': operationId}))
            return
        try:
            # try calling with single params object
            result = method(params) if params else method()
        except TypeError:
            try:
                # try keyword args
                if isinstance(params, dict):
                    result = method(**params)
                else:
                    result = method(params)
            except Exception as e:
                print(json.dumps({'error': 'call_failed', 'trace': traceback.format_exc()}))
                return
        except Exception:
            print(json.dumps({'error': 'call_failed', 'trace': traceback.format_exc()}))
            return

        # try to convert result to JSON
        try:
            print(json.dumps({'statusCode': 200, 'body': result}, default=str))
        except Exception:
            print(json.dumps({'statusCode': 200, 'body': str(result)}))

    except Exception:
        print(json.dumps({'error': 'bridge_error', 'trace': traceback.format_exc()}))

if __name__ == '__main__':
    main()
