# 🚀 VibeProd Setup Instructions

## Step-by-Step Guide to Run Locally

### Step 1: Download the Project
1. Download the entire `vibeprod-app` folder
2. Extract it to your desired location (e.g., Desktop, Documents, etc.)

### Step 2: Open in VS Code
1. Open Visual Studio Code
2. Click `File` → `Open Folder`
3. Select the `vibeprod-app` folder
4. VS Code will open the project

### Step 3: Open Terminal in VS Code
1. In VS Code, press `` Ctrl + ` `` (backtick) or
2. Click `Terminal` → `New Terminal` from the top menu
3. The terminal will open at the bottom of the screen

### Step 4: Install Dependencies
In the terminal, type:
```bash
npm install
```
Press Enter and wait (this might take 1-2 minutes)

**What this does:** Downloads all required packages (React, Vite, Lucide icons, etc.)

### Step 5: Start the Development Server
Once installation is complete, type:
```bash
npm run dev
```
Press Enter

**What this does:** Starts a local server and opens your app in the browser

### Step 6: View Your App
- The app will automatically open in your default browser at `http://localhost:3000`
- If it doesn't open automatically, manually go to: `http://localhost:3000`

### Step 7: Start Using VibeProd! 🎉
You should see:
- Animated particles floating in the background
- 3D logo that tilts when you move your mouse
- Gradient orbs that pulse and move
- The VibeProd interface with Tasks and Focus tabs

---

## 🎮 How to Use the App

### Tasks Tab
1. **AI Task Generator:**
   - Type a goal (e.g., "Build a mobile app")
   - Press Enter or click "⚡ GENERATE"
   - Watch AI create 5 tasks for your goal

2. **Quick Add:**
   - Type a task in the quick add bar
   - Click "ADD" or press Enter

3. **Task Actions:**
   - Click checkbox to mark complete
   - Click X button to delete
   - View priority colors (High=Pink, Medium=Orange, Low=Green)

### Focus Tab
1. Click "TASKS" or "FOCUS" in the navigation
2. Choose Pomodoro (25min) or Deep Work (50min)
3. Click "⚡ START SESSION"
4. Fullscreen timer appears with PAUSE and EXIT buttons

---

## ⚙️ Making Changes

### To Edit the Code:
1. All main code is in `src/App.jsx`
2. Make your changes
3. Save the file (Ctrl+S / Cmd+S)
4. The browser will automatically refresh with your changes!

### To Change Colors:
Search for these in `App.jsx`:
- `#0071e3` - Blue
- `#8a2be2` - Purple  
- `#ff1493` - Pink
- `#000` - Background (pure black)

### To Stop the Server:
In the terminal, press `Ctrl+C`

### To Start Again:
```bash
npm run dev
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "npm: command not found"
**Solution:** You need to install Node.js first
1. Go to https://nodejs.org
2. Download and install the LTS version
3. Restart VS Code
4. Try `npm install` again

### Issue 2: Port 3000 is already in use
**Solution:** Either:
- Stop the other app using port 3000, or
- The app will ask if you want to use a different port - press `Y`

### Issue 3: Blank white screen
**Solution:**
1. Open browser developer tools (F12)
2. Check the Console tab for errors
3. Try refreshing the page (Ctrl+R / Cmd+R)
4. If issues persist, stop server (Ctrl+C) and run `npm run dev` again

### Issue 4: Animations are choppy
**Solution:**
- Close other browser tabs
- Use Chrome or Edge for best performance
- Make sure you're not running too many other apps

### Issue 5: Changes not showing up
**Solution:**
- Make sure you saved the file (Ctrl+S)
- Check if the terminal shows "✓ page reload [file]"
- Try hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

---

## 📁 Project Structure

```
vibeprod-app/
├── public/              # Static assets
│   └── vite.svg        # Favicon
├── src/                # Source code
│   ├── App.jsx         # Main VibeProd component (THE ENTIRE APP!)
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── .eslintrc.cjs       # ESLint configuration
├── .gitignore          # Git ignore rules
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── README.md           # Project documentation
```

---

## 🎯 Next Steps

1. **Try the AI Generator:** Type "Build a SaaS app" and watch it create tasks
2. **Test Focus Mode:** Start a Pomodoro session
3. **Customize Colors:** Change the gradient colors in App.jsx
4. **Add Features:** The code is clean and well-commented - try adding your own features!

---

## 💡 Tips for Development

1. **Auto-save in VS Code:** 
   - Go to File → Preferences → Settings
   - Search "auto save"
   - Set to "afterDelay"

2. **Side-by-side view:**
   - Drag your browser window to one side
   - Keep VS Code on the other side
   - See changes instantly!

3. **Console for debugging:**
   - Press F12 in browser
   - Check Console tab for any errors
   - Use `console.log()` in code to debug

4. **VS Code extensions (optional but helpful):**
   - ES7+ React/Redux snippets
   - Prettier - Code formatter
   - Auto Rename Tag
   - Path Intellisense

---

## ✅ You're All Set!

If everything is working, you should see:
- ✅ Particles floating in the background
- ✅ 3D logo responding to your mouse
- ✅ Smooth gradient animations
- ✅ Tasks and Focus tabs working
- ✅ AI task generator functioning

**Enjoy your insane 3D productivity app!** 🚀✨

If you encounter any issues not covered here, check the browser console (F12) for error messages.
