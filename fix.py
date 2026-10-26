import os

# Fix import path in main.tsx
main_path = r"S:\work\events\nvidia project 2\src\main.tsx"
if os.path.exists(main_path):
    with open(main_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Change import "./src/index.css" to import "./index.css"
    content = content.replace('import "./src/index.css";', 'import "./index.css";')
    content = content.replace("import './src/index.css';", "import './index.css';")
    
    with open(main_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Successfully fixed main.tsx CSS import path")