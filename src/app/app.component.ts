import { Component, computed, signal, viewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import confetti from 'canvas-confetti';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  tasks = signal(JSON.parse(localStorage.getItem('tasks') || '[]') || []);
  isDoingTask = signal(false);
  timer = signal(0);
  intervalId: number | null = null;

  form = new FormGroup({
    task: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
  });

  get task() {
    return this.form.controls.task;
  }

  addTask() {
    if (this.form.invalid) return;
    this.isDoingTask.set(true);
    this.intervalId = setInterval(() => {
      this.timer.set(this.timer() + 1);
    }, 1000);
  }

  stopTask() {
    this.isDoingTask.set(false);

    this.tasks.update((oldTasks) => {
      const newTask = {
        title: this.task.value,
        time_taken: this.timer(),
        colors: [
          this.tailwindColors[this.randomColorKey()].from,
          this.tailwindColors[this.randomColorKey()].to,
        ],
      };
      return [...oldTasks, newTask];
    });

    localStorage.setItem('tasks', JSON.stringify(this.tasks()));

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.task.setValue('');
    this.playSound();
    this.celebrate();
    this.timer.set(0);

    setTimeout(() => {
      this.randomColorKey.set(
        Object.keys(this.tailwindColors)[
          Math.floor(Math.random() * Object.keys(this.tailwindColors).length)
        ]
      );
      console.log('timeout changed the color');
    }, 600);
  }

  playSound() {
    let audio = new Audio();
    audio.src = '/goodresult-82807.mp3';
    audio.load();
    audio.play();
  }

  // made with help of AI
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${this.toArabicNumerals(
      minutes.toString().padStart(2, '0')
    )}:${this.toArabicNumerals(secs.toString().padStart(2, '0'))}`;
  }

  toArabicNumerals(num: string): string {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.replace(/\d/g, (digit) => arabicNumbers[parseInt(digit)]);
  }

  tailwindColors: { [key: string]: { from: string; to: string } } = {
    slate: { from: '#CBD5E1', to: '#1E293B' },
    gray: { from: '#D1D5DB', to: '#111827' },
    zinc: { from: '#D4D4D8', to: '#27272A' },
    neutral: { from: '#E5E5E5', to: '#171717' },
    stone: { from: '#E7E5E4', to: '#1C1917' },
    red: { from: '#FCA5A5', to: '#7F1D1D' },
    orange: { from: '#FDBA74', to: '#9A3412' },
    amber: { from: '#FCD34D', to: '#92400E' },
    yellow: { from: '#FDE047', to: '#854D0E' },
    lime: { from: '#BEF264', to: '#3F6212' },
    green: { from: '#86EFAC', to: '#065F46' },
    emerald: { from: '#6EE7B7', to: '#064E3B' },
    teal: { from: '#5EEAD4', to: '#134E4A' },
    cyan: { from: '#67E8F9', to: '#164E63' },
    sky: { from: '#7DD3FC', to: '#075985' },
    blue: { from: '#93C5FD', to: '#1E40AF' },
    indigo: { from: '#A5B4FC', to: '#3730A3' },
    violet: { from: '#C4B5FD', to: '#4C1D95' },
    purple: { from: '#D8B4FE', to: '#581C87' },
    fuchsia: { from: '#F0ABFC', to: '#701A75' },
    pink: { from: '#F9A8D4', to: '#831843' },
    rose: { from: '#FECDD3', to: '#881337' },
    gold: { from: '#FFD700', to: '#B8860B' },
    silver: { from: '#C0C0C0', to: '#A9A9A9' },
    bronze: { from: '#CD7F32', to: '#8C7853' },
    coral: { from: '#FF7F50', to: '#FF4040' },
    turquoise: { from: '#40E0D0', to: '#008080' },
    magenta: { from: '#FF00FF', to: '#8B008B' },
    lavender: { from: '#E6E6FA', to: '#B57EDC' },
    mint: { from: '#98FF98', to: '#32CD32' },
    peach: { from: '#FFDAB9', to: '#FF6347' },
    plum: { from: '#DDA0DD', to: '#8B008B' },
    salmon: { from: '#FA8072', to: '#E9967A' },
    tan: { from: '#D2B48C', to: '#A0522D' },
  };

  randomColorKey = signal(
    Object.keys(this.tailwindColors)[
      Math.floor(Math.random() * Object.keys(this.tailwindColors).length)
    ]
  );
  gradientStyle = computed(
    () =>
      `background-image: linear-gradient(to bottom, ${
        this.tailwindColors[this.randomColorKey()].from
      }, ${this.tailwindColors[this.randomColorKey()].to})`
  );

  // copied from the docs
  celebrate() {
    const duration = 2000; // in milliseconds

    confetti({
      particleCount: 125,
      spread: 250,
      origin: { y: 0.5 },
    });

    // Clear confetti after a certain duration
    setTimeout(() => confetti.reset(), duration);
  }
}
