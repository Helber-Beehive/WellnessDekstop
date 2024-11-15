const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

let port;
let parser;
let lastCommand = "";

const data1Display = document.getElementById("data1-content");
const data2Display = document.getElementById("data2-content");
const data3Display = document.getElementById("data3-content");
const data4Value1 = document.getElementById("data4-value1");
const data4Value2 = document.getElementById("data4-value2");
const data5Value1 = document.getElementById("data5-value1");
const data5Value2 = document.getElementById("data5-value2");

// Fungsi untuk menginisialisasi koneksi serial
function initializeSerialPort() {
    port = new SerialPort({ path: "COM11", baudRate: 115200 });

    port.on("open", () => {
        console.log("Serial port terbuka.");
        setupDataListener(); // Inisialisasi parser saat port terbuka
    });

    port.on("close", () => {
        console.log("Serial port tertutup. Mencoba reconnect...");
        reconnectSerialPort();
    });

    port.on("error", (err) => {
        console.error("Terjadi error pada serial port:", err.message);
    });
}

// Fungsi reconnect untuk otomatis menghubungkan kembali serial port
function reconnectSerialPort() {
    setTimeout(() => {
        console.log("Mencoba menghubungkan kembali serial port...");
        initializeSerialPort();
    }, 3000); // Tunggu 3 detik sebelum mencoba reconnect
}

// Fungsi untuk mengatur listener parser
function setupDataListener() {
    parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

    parser.on("data", (data) => {
        console.log("Data received:", data);
        updateDisplay(data);
    });

    parser.on("error", (err) => {
        console.error("Error pada parser:", err.message);
    });
}

// Fungsi untuk memperbarui tampilan berdasarkan data dan perintah terakhir
function updateDisplay(data) {
    if (lastCommand === "data1") {
        data1Display.textContent = data;
    } else if (lastCommand === "data2") {
        data2Display.textContent = data;
    } else if (lastCommand === "data3") {
        data3Display.textContent = data;
    } else if (lastCommand === "data4") {
        if (!window.data4Buffer) window.data4Buffer = [];
        
        window.data4Buffer.push(data.trim());
        if (window.data4Buffer.length === 2) {
            data4Value1.textContent = `Value 1: ${window.data4Buffer[0]}`;
            data4Value2.textContent = `Value 2: ${window.data4Buffer[1]}`;
            window.data4Buffer = [];
        }
    } else if (lastCommand === "data5") {
        if (!window.data5Buffer) window.data5Buffer = [];
        
        window.data5Buffer.push(data.trim());
        if (window.data5Buffer.length === 2) {
            data5Value1.textContent = `Value 1: ${window.data5Buffer[0]}`;
            data5Value2.textContent = `Value 2: ${window.data5Buffer[1]}`;
            window.data5Buffer = [];
        }
    }
}

// Fungsi untuk mengatur event listener tombol
function setupButtonListeners() {
    const data1Button = document.getElementById("data1-button");
    const data2Button = document.getElementById("data2-button");
    const data3Button = document.getElementById("data3-button");
    const data4Button = document.getElementById("data4-button");
    const data5Button = document.getElementById("data5-button");

    data1Button.addEventListener("click", () => sendCommand("data1"));
    data2Button.addEventListener("click", () => sendCommand("data2"));
    data3Button.addEventListener("click", () => sendCommand("data3"));
    data4Button.addEventListener("click", () => sendCommand("data4"));
    data5Button.addEventListener("click", () => sendCommand("data5"));

    
}

// Fungsi untuk mengirim perintah ke Arduino
function sendCommand(command) {
    lastCommand = command;
    port.write(`${command}\n`, (err) => {
        if (err) {
            console.error(`Error writing ${command} to serial port:`, err.message);
        } else {
            console.log(`Sent '${command}' to Hardware`);
        }
    });
}

// Inisialisasi saat DOM siap
window.addEventListener("DOMContentLoaded", () => {
    setupButtonListeners(); // Inisialisasi tombol setelah DOM siap
    initializeSerialPort();
});
