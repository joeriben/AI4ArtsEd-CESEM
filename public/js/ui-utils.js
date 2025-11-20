// AI4ArtsEd - UI Utilities Module
import { ui } from './ui-elements.js';

let timerInterval = null;
let animationFrameId = null;
let canvas = null;
let ctx = null;

export function setStatus(message, type = 'info') {
    ui.status.textContent = message;
    ui.status.className = type;
}

export function startProcessingDisplay(message = "Verarbeitung...") {
    let startTime = Date.now();
    ui.submitBtn.disabled = true;
    ui.submitBtn.classList.add('processing');
    ui.processingMessage.textContent = message;
    ui.processingInfo.style.display = 'block';
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        ui.processingTimer.textContent = `Verstrichene Zeit: ${Math.floor((Date.now() - startTime) / 1000)}s`;
    }, 1000);

    // Start animation
    startAnimation();
}

export function stopProcessingDisplay() {
    ui.submitBtn.disabled = false;
    ui.submitBtn.classList.remove('processing');
    ui.processingInfo.style.display = 'none';
    if (timerInterval) clearInterval(timerInterval);

    // Stop animation
    stopAnimation();
}

export function clearOutputDisplays() {
    setStatus('', '');
    ui.imageOutputs.style.display = 'none';
    ui.imageOutputsContent.innerHTML = '';
    ui.textOutputs.style.display = 'none';
    ui.textOutputsContent.innerHTML = '';
    ui.audioContainer.style.display = 'none';
    ui.audioPlayer.pause();
    ui.audioPlayer.removeAttribute('src');
    ui.imageAnalysisDisplay.style.display = 'none';
    ui.imageAnalysisText.textContent = '';
    
    // Remove any existing unified output containers
    const existingUnified = document.getElementById('unifiedOutputs');
    if (existingUnified) {
        existingUnified.remove();
    }
}

export function updateDimensions() {
    const selectedRadio = document.querySelector('input[name="aspectRatio"]:checked');
    const aspectRatio = selectedRadio ? selectedRadio.value : '1:1';
    const dims = calculateDimensions('1024', aspectRatio);
    document.getElementById('dimensionsDisplay').textContent = `Auflösung (ca.): ${dims.width} x ${dims.height}px`;
}

export function calculateDimensions(size, ratio) {
    const side = parseInt(size, 10), total = side * side, [w, h] = ratio.split(':').map(Number);
    const r = w / h; let width = Math.round(Math.sqrt(total * r)); let height = Math.round(width / r);
    return { width: Math.round(width / 8) * 8, height: Math.round(height / 8) * 8 };
}

// ============ ANIMATION FUNCTIONS ============

const shapes = ['🤖', '🌸', '❤️', '⭐', '🎨', '🦋', '🌈', '✨', '💡', '💎', '🔮', '🎭', '🎵', '🔥', '⚡', '🌙', '☀️', '🦄', '🐉', '🍄', '🧩', '🎲', '🗝️', '🌺', '🌻', '💫'];
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
let machine = { x: 0, y: 50, vx: 2, vy: 1, size: 90, angle: 0, jawOpen: 0 };
let trail = [];
let frameCount = 0;
let containerBounds = { left: 0, top: 0, right: 0, bottom: 0 };

function startAnimation() {
    canvas = document.getElementById('animationCanvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');

    // Set canvas size to full viewport
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Get container bounds (the white rectangle)
    const container = document.querySelector('.container');
    if (container) {
        const rect = container.getBoundingClientRect();
        containerBounds = {
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom
        };
    }

    // Show canvas
    canvas.style.display = 'block';

    // Reset machine position with random start (inside container)
    const centerX = (containerBounds.left + containerBounds.right) / 2;
    const centerY = (containerBounds.top + containerBounds.bottom) / 2;
    machine.x = centerX;
    machine.y = centerY;
    machine.vx = 12;
    machine.vy = 6;
    machine.angle = 0;
    machine.jawOpen = 0;
    trail = [];
    frameCount = 0;

    // Start animation loop
    animate();
}

function stopAnimation() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
    }
}

function animate() {
    if (!ctx || !canvas) return;

    // Clear canvas completely (so page shows through clearly)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    frameCount++;

    // Move machine in 2D
    machine.x += machine.vx;
    machine.y += machine.vy;

    // Random direction changes (transgressiv!)
    if (Math.random() < 0.02) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 9 + Math.random() * 9;
        machine.vx = Math.cos(angle) * speed;
        machine.vy = Math.sin(angle) * speed;
    }

    // Bounce off container edges (stay inside the white rectangle)
    const padding = machine.size / 2;

    if (machine.x - padding < containerBounds.left) {
        machine.x = containerBounds.left + padding;
        machine.vx = Math.abs(machine.vx);
    } else if (machine.x + padding > containerBounds.right) {
        machine.x = containerBounds.right - padding;
        machine.vx = -Math.abs(machine.vx);
    }

    if (machine.y - padding < containerBounds.top) {
        machine.y = containerBounds.top + padding;
        machine.vy = Math.abs(machine.vy);
    } else if (machine.y + padding > containerBounds.bottom) {
        machine.y = containerBounds.bottom - padding;
        machine.vy = -Math.abs(machine.vy);
    }

    // Animate jaw (chewing/speaking motion)
    machine.jawOpen = Math.sin(frameCount * 0.15) * 0.5 + 0.5;

    // Add new shape to trail randomly (less frequently for more spacing)
    if (Math.random() < 0.08) {
        trail.push({
            x: machine.x,
            y: machine.y,
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
            size: 60 + Math.random() * 45
        });
    }

    // Draw and fade trail
    trail = trail.filter(shape => {
        shape.alpha -= 0.01;

        if (shape.alpha > 0) {
            ctx.globalAlpha = shape.alpha;
            ctx.font = `${shape.size}px Arial`;
            ctx.fillText(shape.shape, shape.x, shape.y);
            return true;
        }
        return false;
    });

    // Reset alpha
    ctx.globalAlpha = 1;

    // Draw robot head with animated jaw
    ctx.save();
    ctx.translate(machine.x, machine.y);

    const size = machine.size;
    const headSize = size * 0.8;

    // Robot head (main body)
    ctx.fillStyle = '#4A90E2';
    ctx.fillRect(-headSize / 2, -headSize / 2, headSize, headSize * 0.6);

    // Antenna
    ctx.strokeStyle = '#4A90E2';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -headSize / 2);
    ctx.lineTo(0, -headSize / 2 - 15);
    ctx.stroke();
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.arc(0, -headSize / 2 - 15, 5, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(-headSize / 4, -headSize / 4, headSize / 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(headSize / 4, -headSize / 4, headSize / 8, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-headSize / 4, -headSize / 4, headSize / 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(headSize / 4, -headSize / 4, headSize / 16, 0, Math.PI * 2);
    ctx.fill();

    // Upper jaw (fixed)
    ctx.fillStyle = '#4A90E2';
    ctx.fillRect(-headSize / 2, headSize * 0.1, headSize, headSize * 0.15);

    // Lower jaw (animated)
    ctx.save();
    const jawOffset = machine.jawOpen * 10;
    ctx.translate(0, jawOffset);
    ctx.fillStyle = '#3A7BC8';
    ctx.fillRect(-headSize / 2, headSize * 0.25, headSize, headSize * 0.2);
    ctx.restore();

    // Mouth line
    ctx.strokeStyle = '#2A5A8E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-headSize / 3, headSize * 0.23 + jawOffset / 2);
    ctx.lineTo(headSize / 3, headSize * 0.23 + jawOffset / 2);
    ctx.stroke();

    ctx.restore();

    // Continue animation
    animationFrameId = requestAnimationFrame(animate);
}

// ============ END ANIMATION FUNCTIONS ============
