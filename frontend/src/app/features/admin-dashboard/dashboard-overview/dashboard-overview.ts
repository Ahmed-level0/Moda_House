import { Component, signal, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    productsInStock: number;
}

interface TopProduct {
    name: string;
    soldCount: number;
    revenue: number;
}

@Component({
    selector: 'app-dashboard-overview',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard-overview.html',
    styleUrl: './dashboard-overview.scss'
})
export class DashboardOverviewComponent implements OnInit {
    private http = inject(HttpClient);

    @ViewChild('salesChart') salesChartCanvas!: ElementRef<HTMLCanvasElement>;
    private chart?: Chart;

    // Mock data for demonstration
    stats = signal<DashboardStats>({
        totalRevenue: 45780.50,
        totalOrders: 156,
        totalCustomers: 89,
        productsInStock: 234
    });

    topProducts = signal<TopProduct[]>([
        { name: 'Luxury Leather Handbag', soldCount: 45, revenue: 13500 },
        { name: 'Chanel No. 5 Perfume', soldCount: 38, revenue: 9500 },
        { name: 'Silk Scarf Collection', soldCount: 32, revenue: 6400 },
        { name: 'Designer Sunglasses', soldCount: 28, revenue: 8400 },
        { name: 'Premium Watch', soldCount: 22, revenue: 11000 }
    ]);

    loading = signal(false);

    // Mock sales data for the last 30 days
    private generateMockSalesData() {
        const labels: string[] = [];
        const data: number[] = [];

        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

            // Generate random sales between 800 and 2500
            data.push(Math.floor(Math.random() * 1700) + 800);
        }

        return { labels, data };
    }

    ngOnInit() {
        // Try to load real data, fallback to mock data
        this.loadStats();
        this.loadTopProducts();

        // Create chart after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.createSalesChart();
        }, 100);
    }

    createSalesChart() {
        if (!this.salesChartCanvas) {
            console.log('Canvas not ready yet');
            return;
        }

        const { labels, data } = this.generateMockSalesData();

        const ctx = this.salesChartCanvas.nativeElement.getContext('2d');
        if (ctx) {
            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Daily Sales ($)',
                        data: data,
                        borderColor: '#c5a059',
                        backgroundColor: 'rgba(197, 160, 89, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        pointBackgroundColor: '#c5a059',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: '#1a1a1a',
                            titleColor: '#c5a059',
                            bodyColor: '#fff',
                            padding: 12,
                            cornerRadius: 4,
                            displayColors: false,
                            callbacks: {
                                label: (context) => {
                                    const value = context.parsed.y;
                                    return value !== null ? `$${value.toFixed(2)}` : '';
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            },
                            ticks: {
                                color: '#666',
                                callback: (value) => '$' + value
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#666',
                                maxRotation: 45,
                                minRotation: 45
                            }
                        }
                    }
                }
            });
        }
    }

    loadStats() {
        this.loading.set(true);
        this.http.get<DashboardStats>('http://localhost:5000/api/stats/dashboard').subscribe({
            next: (data) => {
                // Only update if we have real data
                if (data.totalOrders > 0 || data.totalRevenue > 0) {
                    this.stats.set(data);
                }
                this.loading.set(false);
            },
            error: (err) => {
                console.log('Using mock data - backend not available');
                // Keep mock data
                this.loading.set(false);
            }
        });
    }

    loadTopProducts() {
        this.http.get<TopProduct[]>('http://localhost:5000/api/stats/top-products').subscribe({
            next: (data) => {
                // Only update if we have real data
                if (data && data.length > 0) {
                    this.topProducts.set(data);
                }
            },
            error: (err) => {
                console.log('Using mock top products - backend not available');
                // Keep mock data
            }
        });
    }
}
