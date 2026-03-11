const fs = require('fs');

const enJsonPath = 'src/assets/i18n/en.json';
const arJsonPath = 'src/assets/i18n/ar.json';

const en = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
const ar = JSON.parse(fs.readFileSync(arJsonPath, 'utf8'));

// 1. Add keys to JSON
en.admin = en.admin || {};
ar.admin = ar.admin || {};

en.admin.settings = {
    title: "Admin Settings",
    profile_info: "Profile Information",
    change_password: "Change Password",
    store_settings: "Store Settings",
    profile_desc: "Update your admin account details and email address.",
    username: "Username",
    email: "Email Address",
    save_changes: "Save Changes",
    password_desc: "Ensure your account is using a long, random password to stay secure.",
    current_pass: "Current Password",
    new_pass: "New Password",
    confirm_pass: "Confirm New Password",
    update_pass: "Update Password",
    store_desc: "Configure your online store's public identity and tax settings.",
    store_name: "Store Name",
    support_email: "Support Email",
    currency: "Default Currency",
    tax_rate: "Tax Rate (%)",
    save_store: "Save Store Settings"
};
ar.admin.settings = {
    title: "إعدادات المسؤول",
    profile_info: "معلومات الملف الشخصي",
    change_password: "تغيير كلمة المرور",
    store_settings: "إعدادات المتجر",
    profile_desc: "قم بتحديث تفاصيل حساب المسؤول وعنوان البريد الإلكتروني.",
    username: "اسم المستخدم",
    email: "البريد الإلكتروني",
    save_changes: "حفظ التغييرات",
    password_desc: "تأكد من استخدام حسابك لكلمة مرور طويلة وعشوائية للبقاء آمناً.",
    current_pass: "كلمة المرور الحالية",
    new_pass: "كلمة المرور الجديدة",
    confirm_pass: "تأكيد كلمة المرور الجديدة",
    update_pass: "تحديث كلمة المرور",
    store_desc: "قم بتهيئة الهوية العامة لمتجرك عبر الإنترنت وإعدادات الضرائب.",
    store_name: "اسم المتجر",
    support_email: "بريد الدعم",
    currency: "العملة الافتراضية",
    tax_rate: "معدل الضريبة (%)",
    save_store: "حفظ إعدادات المتجر"
};

en.admin.users = {
    title: "Manage Users",
    username: "Username",
    email: "Email",
    role: "Role",
    actions: "Actions",
    demote: "Demote to User",
    promote: "Promote to Admin",
    empty: "No users found"
};
ar.admin.users = {
    title: "إدارة المستخدمين",
    username: "اسم المستخدم",
    email: "البريد الإلكتروني",
    role: "الدور",
    actions: "الإجراءات",
    demote: "تخفيض إلى مستخدم",
    promote: "ترقية إلى مسؤول",
    empty: "لا يوجد مستخدمين"
};

en.admin.categories = {
    title: "Manage Categories",
    add: "Add Category",
    edit_cat: "Edit Category",
    add_new: "Add New Category",
    name: "Category Name *",
    image: "Image URL *",
    desc: "Description *",
    featured_cat: "Featured Category",
    cancel: "Cancel",
    save: "Save Category",
    featured: "Featured",
    products: "Products",
    edit: "Edit",
    delete: "Delete",
    empty_title: "No Categories Found",
    empty_desc: "Start by adding your first category"
};
ar.admin.categories = {
    title: "إدارة التصنيفات",
    add: "إضافة تصنيف",
    edit_cat: "تعديل التصنيف",
    add_new: "إضافة تصنيف جديد",
    name: "اسم التصنيف *",
    image: "رابط الصورة *",
    desc: "الوصف *",
    featured_cat: "تصنيف مميز",
    cancel: "إلغاء",
    save: "حفظ التصنيف",
    featured: "مميز",
    products: "منتجات",
    edit: "تعديل",
    delete: "حذف",
    empty_title: "لا توجد تصنيفات",
    empty_desc: "ابدأ بإضافة تصنيفك الأول"
};

en.admin.analytics = {
    title: "Analytics & Reports",
    loading: "Loading analytics...",
    revenue: "Total Revenue",
    vs_last_month: "from last month",
    orders: "Total Orders",
    customers: "Total Customers",
    avg_order: "Avg Order Value",
    trend_title: "Revenue Trend (Last 12 Months)",
    sales_cat: "Sales by Category",
    new_customers: "New Customers (This Month)",
    insights_title: "Key Insights",
    best_selling: "Best Selling Category",
    best_selling_desc: "Bags account for 35% of total sales",
    peak_time: "Peak Sales Time",
    peak_time_desc: "Most orders placed between 2-6 PM",
    retention: "Customer Retention",
    retention_desc: "68% of customers are repeat buyers",
    mobile: "Mobile Traffic",
    mobile_desc: "45% of orders from mobile devices"
};
ar.admin.analytics = {
    title: "التحليلات والتقارير",
    loading: "جاري تحميل التحليلات...",
    revenue: "إجمالي الإيرادات",
    vs_last_month: "عن الشهر الماضي",
    orders: "إجمالي الطلبات",
    customers: "إجمالي العملاء",
    avg_order: "متوسط قيمة الطلب",
    trend_title: "اتجاه الإيرادات (آخر 12 شهرًا)",
    sales_cat: "المبيعات حسب التصنيف",
    new_customers: "عملاء جدد (هذا الشهر)",
    insights_title: "رؤى رئيسية",
    best_selling: "التصنيف الأكثر مبيعًا",
    best_selling_desc: "تمثل الحقائب 35% من إجمالي المبيعات",
    peak_time: "وقت ذروة المبيعات",
    peak_time_desc: "يتم تقديم معظم الطلبات بين 2-6 مساءً",
    retention: "الاحتفاظ بالعملاء",
    retention_desc: "68% من العملاء هم مشترون متكررون",
    mobile: "حركة مرور الهاتف المحمول",
    mobile_desc: "45% من الطلبات من الأجهزة المحمولة"
};

fs.writeFileSync(enJsonPath, JSON.stringify(en, null, 4));
fs.writeFileSync(arJsonPath, JSON.stringify(ar, null, 4));

// 2. Replace HTML files
function replaceInFile(path, replacements) {
    let content = fs.readFileSync(path, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.split(search).join(replace);
    }
    fs.writeFileSync(path, content);
}

// 2.1 Settings
replaceInFile('src/app/features/admin-dashboard/settings/settings.html', [
    ['<h2>Admin Settings</h2>', `<h2>{{ t('admin.settings.title') }}</h2>`],
    ['<span>Profile Information</span>', `<span>{{ t('admin.settings.profile_info') }}</span>`],
    ['<span>Change Password</span>', `<span>{{ t('admin.settings.change_password') }}</span>`],
    ['<span>Store Settings</span>', `<span>{{ t('admin.settings.store_settings') }}</span>`],
    ['<h3>Profile Information</h3>', `<h3>{{ t('admin.settings.profile_info') }}</h3>`],
    ['<p class="section-desc">Update your admin account details and email address.</p>', `<p class="section-desc">{{ t('admin.settings.profile_desc') }}</p>`],
    ['<label>Username</label>', `<label>{{ t('admin.settings.username') }}</label>`],
    ['<label>Email Address</label>', `<label>{{ t('admin.settings.email') }}</label>`],
    ['<button type="submit" class="btn-save">Save Changes</button>', `<button type="submit" class="btn-save">{{ t('admin.settings.save_changes') }}</button>`],
    ['<h3>Change Password</h3>', `<h3>{{ t('admin.settings.change_password') }}</h3>`],
    ['<p class="section-desc">Ensure your account is using a long, random password to stay secure.</p>', `<p class="section-desc">{{ t('admin.settings.password_desc') }}</p>`],
    ['<label>Current Password</label>', `<label>{{ t('admin.settings.current_pass') }}</label>`],
    ['<label>New Password</label>', `<label>{{ t('admin.settings.new_pass') }}</label>`],
    ['<label>Confirm New Password</label>', `<label>{{ t('admin.settings.confirm_pass') }}</label>`],
    ['<button type="submit" class="btn-save">Update Password</button>', `<button type="submit" class="btn-save">{{ t('admin.settings.update_pass') }}</button>`],
    ['<h3>Store Settings</h3>', `<h3>{{ t('admin.settings.store_settings') }}</h3>`],
    ['<p class="section-desc">Configure your online store\'s public identity and tax settings.</p>', `<p class="section-desc">{{ t('admin.settings.store_desc') }}</p>`],
    ['<label>Store Name</label>', `<label>{{ t('admin.settings.store_name') }}</label>`],
    ['<label>Support Email</label>', `<label>{{ t('admin.settings.support_email') }}</label>`],
    ['<label>Default Currency</label>', `<label>{{ t('admin.settings.currency') }}</label>`],
    ['<label>Tax Rate (%)</label>', `<label>{{ t('admin.settings.tax_rate') }}</label>`],
    ['<button type="submit" class="btn-save">Save Store Settings</button>', `<button type="submit" class="btn-save">{{ t('admin.settings.save_store') }}</button>`]
]);

// 2.2 Manage Users
replaceInFile('src/app/features/admin-dashboard/manage-users/manage-users.html', [
    ['<h2>Manage Users</h2>', `<h2>{{ t('admin.users.title') }}</h2>`],
    ['<th>Username</th>', `<th>{{ t('admin.users.username') }}</th>`],
    ['<th>Email</th>', `<th>{{ t('admin.users.email') }}</th>`],
    ['<th>Role</th>', `<th>{{ t('admin.users.role') }}</th>`],
    ['<th>Actions</th>', `<th>{{ t('admin.users.actions') }}</th>`],
    ["{{ user.role === 'admin' ? 'Demote to User' : 'Promote to Admin' }}", `{{ user.role === 'admin' ? t('admin.users.demote') : t('admin.users.promote') }}`],
    ['No users found', `{{ t('admin.users.empty') }}`]
]);

// 2.3 Manage Categories
replaceInFile('src/app/features/admin-dashboard/manage-categories/manage-categories.html', [
    ['<h2>Manage Categories</h2>', `<h2>{{ t('admin.categories.title') }}</h2>`],
    ['Add Category', `{{ t('admin.categories.add') }}`],
    ["{{ editingCategory() ? 'Edit Category' : 'Add New Category' }}", `{{ editingCategory() ? t('admin.categories.edit_cat') : t('admin.categories.add_new') }}`],
    ['<label>Category Name *</label>', `<label>{{ t('admin.categories.name') }}</label>`],
    ['<label>Image URL *</label>', `<label>{{ t('admin.categories.image') }}</label>`],
    ['<label>Description *</label>', `<label>{{ t('admin.categories.desc') }}</label>`],
    ['<span>Featured Category</span>', `<span>{{ t('admin.categories.featured_cat') }}</span>`],
    ['Cancel', `{{ t('admin.categories.cancel') }}`],
    ['Save Category', `{{ t('admin.categories.save') }}`],
    ['> Featured\n', `> {{ t('admin.categories.featured') }}\n`],
    ['Products\n', `{{ t('admin.categories.products') }}\n`],
    ['Edit\n', `{{ t('admin.categories.edit') }}\n`],
    ['Delete\n', `{{ t('admin.categories.delete') }}\n`],
    ['<h3>No Categories Found</h3>', `<h3>{{ t('admin.categories.empty_title') }}</h3>`],
    ['<p>Start by adding your first category</p>', `<p>{{ t('admin.categories.empty_desc') }}</p>`]
]);

// 2.4 Analytics
replaceInFile('src/app/features/admin-dashboard/analytics/analytics.html', [
    ['<h1>Analytics & Reports</h1>', `<h1>{{ t('admin.analytics.title') }}</h1>`],
    ['Loading analytics...', `{{ t('admin.analytics.loading') }}`],
    ['<h3>Total Revenue</h3>', `<h3>{{ t('admin.analytics.revenue') }}</h3>`],
    ['from last month\n', `{{ t('admin.analytics.vs_last_month') }}\n`],
    ['<h3>Total Orders</h3>', `<h3>{{ t('admin.analytics.orders') }}</h3>`],
    ['<h3>Total Customers</h3>', `<h3>{{ t('admin.analytics.customers') }}</h3>`],
    ['<h3>Avg Order Value</h3>', `<h3>{{ t('admin.analytics.avg_order') }}</h3>`],
    ['Revenue Trend (Last 12 Months)', `{{ t('admin.analytics.trend_title') }}`],
    ['Sales by Category', `{{ t('admin.analytics.sales_cat') }}`],
    ['New Customers (This Month)', `{{ t('admin.analytics.new_customers') }}`],
    ['Key Insights', `{{ t('admin.analytics.insights_title') }}`],
    ['<h3>Best Selling Category</h3>', `<h3>{{ t('admin.analytics.best_selling') }}</h3>`],
    ['<p>Bags account for 35% of total sales</p>', `<p>{{ t('admin.analytics.best_selling_desc') }}</p>`],
    ['<h3>Peak Sales Time</h3>', `<h3>{{ t('admin.analytics.peak_time') }}</h3>`],
    ['<p>Most orders placed between 2-6 PM</p>', `<p>{{ t('admin.analytics.peak_time_desc') }}</p>`],
    ['<h3>Customer Retention</h3>', `<h3>{{ t('admin.analytics.retention') }}</h3>`],
    ['<p>68% of customers are repeat buyers</p>', `<p>{{ t('admin.analytics.retention_desc') }}</p>`],
    ['<h3>Mobile Traffic</h3>', `<h3>{{ t('admin.analytics.mobile') }}</h3>`],
    ['<p>45% of orders from mobile devices</p>', `<p>{{ t('admin.analytics.mobile_desc') }}</p>`]
]);

console.log("Translation components replaced.");
