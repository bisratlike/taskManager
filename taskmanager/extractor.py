import os
from pathlib import Path

def extract_ts_files_recursively(directory):
    dir_path = Path(directory)
    ts_files = []
    for file in dir_path.rglob("*.*"):
        if file.suffix in ['.ts', '.tsx']:
            ts_files.append(file)
    return ts_files

def write_files_to_output(files, output_file):
    with open(output_file, 'w', encoding='utf-8') as output:
        for file in files:
            output.write(f"--- File: {file.relative_to(os.getcwd())} ---\n")
            try:
                with open(file, 'r', encoding='utf-8') as f:
                    output.write(f.read())
            except Exception as e:
                output.write(f"Error reading file: {e}\n")
            output.write("\n\n")

directories = ['app', 'components', 'drizzle']
all_ts_files = []

for directory in directories:
    full_path = Path(os.getcwd()) / directory
    if full_path.exists() and full_path.is_dir():
        all_ts_files.extend(extract_ts_files_recursively(full_path))

output_file = Path(os.getcwd()) / 'output.txt'
write_files_to_output(all_ts_files, output_file)

print(f"Extracted contents from TypeScript files have been written to {output_file}")
