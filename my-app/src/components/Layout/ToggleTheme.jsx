import React from "react";

const ToggleTheme = ({ stageRef }) => {
  const [darkMode, setDarkMode] = React.useState(
    () => localStorage.getItem("theme") === "dark"
  );

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");

      // 🔑 Change Konva stage container background
      if (stageRef?.current) {
        stageRef.current.container().style.backgroundColor = "black";
      }
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");

      if (stageRef?.current) {
        stageRef.current.container().style.backgroundColor = "white";
      }
    }
  }, [darkMode, stageRef]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className='text-white rounded-2xl bg-green-700 px-4 py-3 '
    >
      {darkMode ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
};

export default ToggleTheme;
