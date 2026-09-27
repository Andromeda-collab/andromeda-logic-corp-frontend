import json

log_file = r'C:\Users\565ga\.gemini\antigravity\brain\92956bac-3330-4ddb-8204-d9aeec88bece\.system_generated\logs\transcript_full.jsonl'
with open(log_file, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if 'content' in data and 'const pillars = [' in data['content']:
                print(data['content'])
                print('--- END MATCH ---')
        except:
            pass
