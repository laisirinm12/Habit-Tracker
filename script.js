const habitInput = document.querySelector("#habit-input");
const addBtn = document.querySelector("#add-btn");
const habitList = document.querySelector("#habit-list");
const progressBar = document.querySelector("#progress-bar");
const themeToggle = document.querySelector("#theme-toggle");
const habitCounter = document.querySelector("#habit-counter");
const datePicker = document.querySelector("#date-picker");
const mascotEmoji = document.querySelector("#mascot-emoji");
const mascotText = document.querySelector("#mascot-text");
const todayLabel = document.querySelector("#today-label");

let habits = [];
const today = new Date().toISOString().split("T")[0];
let selectedDate = new Date().toISOString().split("T")[0];
if (todayLabel) {
    todayLabel.textContent = "Selected: " + selectedDate;
}
datePicker.value = selectedDate;

/* LOAD HABITS */

function loadHabits() {
    const saved = localStorage.getItem("habits");

    if (saved) {
        habits = JSON.parse(saved);
    }
}

/* SAVE HABITS */

function saveHabits() {
    localStorage.setItem("habits", JSON.stringify(habits));
}

/* ADD HABIT */

function addHabit() {

    const text = habitInput.value.trim();

    if (text === "") return;

    if (habits.some(h => h.text.toLowerCase() === text.toLowerCase())) {
        alert("Habit already exists!");
        return;
    }

    habits.push({
        text: text,
        dates: {}
    });

    habitInput.value = "";

    saveHabits();
    renderHabits();
}

/* DELETE HABIT */

function deleteHabit(index) {

    habits.splice(index, 1);

    saveHabits();
    renderHabits();
}

/* TOGGLE HABIT */

function toggleHabit(index, checked) {

    if (checked) {
        habits[index].dates[selectedDate] = true;
    } else {
        delete habits[index].dates[selectedDate];
    }

    saveHabits();
    renderHabits();
}

/* UPDATE PROGRESS */

function updateProgress() {

    const total = habits.length;

    const completed = habits.filter(h => h.dates[selectedDate]).length;

    const percent = total === 0 ? 0 : (completed / total) * 100;

    progressBar.style.width = percent + "%";

    habitCounter.textContent = `Habits Crushed: ${completed} / ${total}`;

    if (percent <= 20) {
        progressBar.style.background = "#ff4d4d";
    }
    else if (percent <= 40) {
        progressBar.style.background = "#ff944d";
    }
    else if (percent <= 60) {
        progressBar.style.background = "#ffd24d";
    }
    else if (percent <= 80) {
        progressBar.style.background = "#8bdc65";
    }
    else {
        progressBar.style.background = "#4CAF50";
    }

    updateMascot(percent);
}

/* MASCOT */

function updateMascot(percent) {

    if (percent === 0) {
        mascotEmoji.textContent = "😴";
        mascotText.textContent = "Bro… nothing yet? Let's move.";
    }

    else if (percent <= 25) {
        mascotEmoji.textContent = "🙂";
        mascotText.textContent = "Okay okay… we started.";
    }

    else if (percent <= 50) {
        mascotEmoji.textContent = "😏";
        mascotText.textContent = "Half way done. Keep pushing.";
    }

    else if (percent <= 75) {
        mascotEmoji.textContent = "💪";
        mascotText.textContent = "Now we're talking.";
    }

    else if (percent <= 99) {
        mascotEmoji.textContent = "🔥";
        mascotText.textContent = "So close. Finish it!";
    }

    else {
        mascotEmoji.textContent = "🏆";
        mascotText.textContent = "Dammn. Perfect day!";
    }
}

/* RENDER HABITS */

function renderHabits() {

    habitList.innerHTML = "";

    if (habits.length === 0) {
        habitList.innerHTML = "<p style='text-align:center;color:gray;'>No habits yet. Your future self is disappointed.</p>";
        updateProgress();
        return;
    }

    const sortedHabits = habits
        .map((habit, index) => ({ habit, index }))
        .sort((a, b) => {
            const aDone = a.habit.dates[selectedDate] ? 1 : 0;
            const bDone = b.habit.dates[selectedDate] ? 1 : 0;
            return aDone - bDone;
        });

    sortedHabits.forEach(({ habit, index }) => {

        const li = document.createElement("li");

        const completed = habit.dates[selectedDate] === true;

        if (completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
        <input type="checkbox" ${completed ? "checked" : ""}>
        <span>${habit.text}</span>
        <button class="delete-btn">🗑</button>
        `;

        const checkbox = li.querySelector("input");
        const deleteBtn = li.querySelector("button");

        checkbox.addEventListener("change", (e) => {
            toggleHabit(index, e.target.checked);
        });

        deleteBtn.addEventListener("click", () => {
            deleteHabit(index);
        });

        habitList.appendChild(li);

    });

    updateProgress();
}

/* EVENT LISTENERS */

addBtn.addEventListener("click", addHabit);

habitInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addHabit();
    }
});



datePicker.addEventListener("change", function (e) {

    const pickedDate = e.target.value;

    const picked = new Date(pickedDate);
    const current = new Date(today);

    if (picked > current) {

        alert("Time traveler detected !!! Tomorrow isn't here yet.");
        datePicker.value = today;
        selectedDate = today;

        renderHabits();

        return;
    }

    selectedDate = pickedDate;
    renderHabits();
});

/* THEME TOGGLE */

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const theme = document.body.classList.contains("dark") ? "dark" : "light";

    localStorage.setItem("theme", theme);

});

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");
}

/* START APP */

loadHabits();
renderHabits();

