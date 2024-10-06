import os
import json

folder_path = "tldr"
manifest = {}

for language in os.listdir(folder_path):
    # Extract the language code by splitting on the dot and taking the second part
    lang_code = language.split('.')[-1]
    
    lang_path = os.path.join(folder_path, language)
    if os.path.isdir(lang_path):
        manifest[lang_code] = {}  # Use the language code (e.g., "ar", "bn") as the key
        for section in os.listdir(lang_path):
            section_path = os.path.join(lang_path, section)
            if os.path.isdir(section_path):
                # Collect all the markdown filenames in this section, removing the '.md' extension
                manifest[lang_code][section] = [os.path.splitext(file)[0] for file in os.listdir(section_path) if file.endswith(".md")]

manifest_path = os.path.join(folder_path, "manifest.json")
with open(manifest_path, "w") as manifest_file:
    json.dump(manifest, manifest_file, indent=4)

