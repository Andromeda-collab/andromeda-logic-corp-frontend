import json
import re

log_file = r'C:\Users\565ga\.gemini\antigravity\brain\92956bac-3330-4ddb-8204-d9aeec88bece\.system_generated\logs\transcript_full.jsonl'

best_content = None
with open(log_file, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if 'tool_calls' in data:
                for tc in data['tool_calls']:
                    if tc['name'] == 'write_to_file' and 'Home' in tc['args'].get('TargetFile', ''):
                        best_content = tc['args'].get('CodeContent', '')
            if data.get('type') == 'GENERIC' and 'Output:' in data.get('content', ''):
                # Maybe a cat command?
                pass
        except Exception:
            pass

if best_content:
    with open(r'C:\Users\565ga\Desktop\New folder (5)\_x\_x\Andromeda DEV\src\pages\Home\index.jsx', 'w', encoding='utf-8') as out:
        out.write(best_content)
    print("RESTORED FROM write_to_file!")
else:
    print("NOT FOUND")
