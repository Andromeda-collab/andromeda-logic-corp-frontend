import json
log_file = r'C:\Users\565ga\.gemini\antigravity\brain\92956bac-3330-4ddb-8204-d9aeec88bece\.system_generated\logs\transcript_full.jsonl'
for line in open(log_file, 'r', encoding='utf-8'):
    if 'Checking pillars array' in line:
        pass
    if 'GENERIC' in line and 'const pillars =' in line:
        data = json.loads(line)
        print(data['content'][:1000]) # just to see
