import os
import re

backup_dir = r"C:\Users\565ga\Desktop\Andromeda_Locic_corp\_x\_x\Andromeda DEV\src\pages_backend_backup"
target_dir = r"C:\Users\565ga\Desktop\Andromeda_Locic_corp\_x\_x\Andromeda DEV\src\pages"

def merge_file(rel_path):
    backup_path = os.path.join(backup_dir, rel_path)
    target_path = os.path.join(target_dir, rel_path)
    
    if not os.path.exists(backup_path) or not os.path.exists(target_path):
        return

    with open(backup_path, 'r', encoding='utf-8') as f:
        backup_content = f.read()

    with open(target_path, 'r', encoding='utf-8') as f:
        target_content = f.read()

    # If the backup doesn't have useApiResource or import from services, skip
    if 'useApiResource' not in backup_content and 'services/' not in backup_content:
        return

    print(f"Merging {rel_path}...")

    new_content = backup_content
    # Remove motion classes I added earlier
    classes_to_remove = [
        r'alc-eyebrow-reveal',
        r'split-text__inner',
        r'split-text__line',
        r'split-text',
        r'reveal--up',
        r'reveal--scale',
        r'reveal-delay-\d+',
        r'stagger-children'
    ]
    
    for cls in classes_to_remove:
        new_content = re.sub(r'\b' + cls + r'\b', '', new_content)
        
    # Clean up empty classNames
    new_content = re.sub(r'className="\s+"', 'className=""', new_content)
    new_content = re.sub(r'className={`\s+`}', 'className={``}', new_content)

    with open(target_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

for root, _, files in os.walk(backup_dir):
    for file in files:
        if file.endswith('.jsx'):
            rel_path = os.path.relpath(os.path.join(root, file), backup_dir)
            if not rel_path.startswith('Products') and not rel_path.startswith('Technology'):
                merge_file(rel_path)

print("Done merging.")
