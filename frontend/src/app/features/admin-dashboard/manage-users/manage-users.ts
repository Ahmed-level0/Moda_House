import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
}

@Component({
    selector: 'app-manage-users',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './manage-users.html',
    styleUrl: './manage-users.scss'
})
export class ManageUsersComponent implements OnInit {
    private http = inject(HttpClient);

    // Mock users for demonstration
    users = signal<User[]>([
        {
            _id: '1',
            username: 'John Doe',
            email: 'john@example.com',
            role: 'user'
        },
        {
            _id: '2',
            username: 'Jane Smith',
            email: 'jane@example.com',
            role: 'user'
        },
        {
            _id: '3',
            username: 'Admin User',
            email: 'admin@modahouse.com',
            role: 'admin'
        },
        {
            _id: '4',
            username: 'Sarah Johnson',
            email: 'sarah@example.com',
            role: 'user'
        }
    ]);

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.http.get<User[]>('http://localhost:5000/api/users').subscribe({
            next: (data) => {
                if (data && data.length > 0) {
                    this.users.set(data);
                }
            },
            error: (err) => {
                console.log('Using mock users - backend not available');
                // Keep mock data
            }
        });
    }

    toggleRole(user: User) {
        const newRole = user.role === 'admin' ? 'user' : 'admin';

        this.http.put(`http://localhost:5000/api/users/${user._id}/role`, { role: newRole }).subscribe({
            next: () => this.loadUsers(),
            error: (err) => {
                console.error('Failed to update user role', err);
                // Update mock data
                this.users.update(users =>
                    users.map(u => u._id === user._id ? { ...u, role: newRole } : u)
                );
            }
        });
    }
}
