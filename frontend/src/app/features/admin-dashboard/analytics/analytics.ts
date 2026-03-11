import { Component, signal, inject, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslationService } from '../../../core/services/translation.service';import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface AnalyticsData {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    avgOrderValue: number;
}

@Component({
    selector: 'app-analytics',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './analytics.html',
    styleUrl: './analytics.scss'
})
export class AnalyticsComponent implements OnInit, AfterViewInit {
    private http = inject(HttpClient);
    public translationService = inject(TranslationService);
    t = this.translationService.translate.bind(this.translationService);
    @ViewChild('revenueChart') revenueChartCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('categoryChart') categoryChartCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('customerChart') customerChartCanvas!: ElementRef<HTMLCanvasElement>;

    private revenueChart?: Chart;
    private categoryChart?: Chart;
    private customerChart?: Chart;

    stats = signal<AnalyticsData>({
        totalRevenue: 125430.75,
        totalOrders: 456,
        totalCustomers: 234,
        avgOrderValue: 275.07
    });

    loading = signal(false);

    ngOnInit() {
        this.loadAnalytics();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.createRevenueChart();
            this.createCategoryChart();
            this.createCustomerChart();
        }, 100);
    }

    loadAnalytics() {
        this.loading.set(true);
        this.http.get<AnalyticsData>('http://localhost:5000/api/stats/analytics').subscribe({
            next: (data) => {
                if (data) {
                    this.stats.set(data);
                }
                this.loading.set(false);
            },
            error: (err) => {
                console.log('Using mock analytics data');
                this.loading.set(false);
            }
        });
    }

    createRevenueChart() {
        if (!this.revenueChartCanvas) return;

        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const data = [12500, 15200, 18300, 16800, 21400, 19500, 23100, 25600, 22800, 26300, 28900, 31200];

        const ctx = this.revenueChartCanvas.nativeElement.getContext('2d');
        if (ctx) {
            this.revenueChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Monthly Revenue ($)',
                        data: data,
                        borderColor: '#c5a059',
                        backgroundColor: 'rgba(197, 160, 89, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#c5a059',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#1a1a1a',
                            titleColor: '#c5a059',
                            bodyColor: '#fff',
                            padding: 12,
                            cornerRadius: 4
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0, 0, 0, 0.05)' },
                            ticks: { color: '#666', callback: (value) => '$' + value }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#666' }
                        }
                    }
                }
            });
        }
    }

    createCategoryChart() {
        if (!this.categoryChartCanvas) return;

        const ctx = this.categoryChartCanvas.nativeElement.getContext('2d');
        if (ctx) {
            this.categoryChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Bags', 'Perfumes', 'Scarfs', 'Accessories'],
                    datasets: [{
                        data: [35, 28, 22, 15],
                        backgroundColor: [
                            '#c5a059',
                            '#1a1a1a',
                            '#8B4513',
                            '#666666'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: '#666', padding: 15, font: { size: 12 } }
                        },
                        tooltip: {
                            backgroundColor: '#1a1a1a',
                            titleColor: '#c5a059',
                            bodyColor: '#fff',
                            padding: 12,
                            cornerRadius: 4,
                            callbacks: {
                                label: (context) => {
                                    const value = context.parsed;
                                    return value !== null ? `${context.label}: ${value}%` : '';
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    createCustomerChart() {
        if (!this.customerChartCanvas) return;

        const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        const data = [45, 62, 58, 69];

        const ctx = this.customerChartCanvas.nativeElement.getContext('2d');
        if (ctx) {
            this.customerChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'New Customers',
                        data: data,
                        backgroundColor: 'rgba(197, 160, 89, 0.8)',
                        borderColor: '#c5a059',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#1a1a1a',
                            titleColor: '#c5a059',
                            bodyColor: '#fff',
                            padding: 12,
                            cornerRadius: 4
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0, 0, 0, 0.05)' },
                            ticks: { color: '#666' }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#666' }
                        }
                    }
                }
            });
        }
    }
}
