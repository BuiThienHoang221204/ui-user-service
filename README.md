# Lumina Studio - User Management Micro Frontend (`user-mfe`)

`user-mfe` là một Micro Frontend độc lập quản lý danh sách thành viên, phân quyền và giám sát hoạt động trong hệ thống **Lumina Studio**. 

Được thiết kế theo tiêu chuẩn UI/UX SaaS cao cấp (Dark Mode, Neon pills, Glassmorphism, animations mượt mà), sản phẩm có khả năng:
1. **Chạy độc lập (Standalone)** trên cổng **`3003`** phục vụ việc phát triển, kiểm thử cô lập.
2. **Tích hợp micro-frontend** hoàn hảo vào Shell App sử dụng **Vite Module Federation** (`user_mfe/App`).
3. **Offline Fallback System**: Tự động chuyển đổi mượt mà sang Cơ sở dữ liệu Mock (lưu tại `localStorage`) nếu API Gateway ngắt kết nối, đảm bảo giao diện luôn tương tác được hoàn chỉnh.

---

## 🛠️ Cấu trúc thư mục định hướng Feature-based

```
src/
├── app/
│   ├── App.tsx          # Điểm kết nối Providers (React Query, Router)
│   └── router.tsx       # Cấu hình định tuyến v6 độc lập/tích hợp
├── features/
│   └── users/
│       ├── pages/       # Các trang CRUD chức năng
│       │   ├── UserListPage.tsx
│       │   ├── UserDetailPage.tsx
│       │   ├── CreateUserPage.tsx
│       │   └── EditUserPage.tsx
│       ├── components/  # Các component nhỏ chuyên biệt
│       │   ├── UserStats.tsx
│       │   ├── UserTable.tsx
│       │   ├── PermissionsAndActivity.tsx
│       │   └── DeleteConfirmModal.tsx
│       ├── services/    # Tương tác Axios REST APIs
│       │   └── userService.ts
│       ├── hooks/       # Custom hooks TanStack Query tích hợp Mock
│       │   └── useUsers.ts
│       └── types/       # Khai báo TypeScript Types
│           └── index.ts
├── shared/
│   ├── api/             # Thiết lập Axios Client kết nối Gateway
│   │   └── axiosClient.ts
│   ├── components/      # Toast Notification dùng chung
│   │   └── ToastNotification.tsx
│   └── layouts/         # Khung bao Sidebar & Header Lumina Studio
│       └── DashboardLayout.tsx
├── main.tsx
└── index.css            # Custom CSS keyframes animation
```

---

## 🚀 Hướng dẫn Chạy cục bộ (Development)

### Yêu cầu hệ thống
- **pnpm** (phiên bản v8 hoặc v10)
- **Node.js** (v18 trở lên)

### Các bước cài đặt
1. Cài đặt các gói phụ thuộc:
   ```bash
   pnpm install
   ```

2. Tạo cấu hình môi trường `.env`:
   ```bash
   cp .env.example .env
   ```
  *Mặc định `VITE_API_BASE_URL` trỏ tới `/api-user` để đi qua proxy cùng-origin và tránh preflight CORS với bearer token.* 

3. Khởi chạy máy chủ phát triển độc lập (Standalone):
   ```bash
   pnpm dev
   ```
   Ứng dụng sẽ chạy tại địa chỉ: **`http://localhost:3003/`**

---

## 🔗 Tích hợp vào Shell App (Host Application)

Ứng dụng này expose điểm khởi chạy chính thông qua Module Federation với cấu hình sau:

### Cấu hình tại `user-mfe` (`vite.config.ts`)
```typescript
federation({
  name: 'user_mfe',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/app/App.tsx',
  },
  shared: ['react', 'react-dom', '@tanstack/react-query', 'react-router-dom'],
})
```

### Cấu hình nạp vào Shell App (`vite.config.ts`)
Để tích hợp component quản lý user vào ứng dụng Shell, cấu hình Module Federation remotes tại Shell App của bạn:
```typescript
federation({
  name: 'shell_app',
  remotes: {
    user_mfe: 'http://localhost:3003/assets/remoteEntry.js', // hoặc đường dẫn production deploy
  },
  shared: ['react', 'react-dom', '@tanstack/react-query', 'react-router-dom']
})
```

### Cách gọi Component trong Shell App
Khai báo Lazy component trong Router của Shell App:
```tsx
import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const UserManagementMFE = React.lazy(() => import('user_mfe/App'));

export const ShellRouter = () => {
  return (
    <Routes>
      {/* Khai báo route wildcard để MFE tự xử lý các route nội bộ của nó */}
      <Route 
        path="/users/*" 
        element={
          <Suspense fallback={<div className="text-slate-400">Đang tải phân hệ Users...</div>}>
            <UserManagementMFE />
          </Suspense>
        } 
      />
    </Routes>
  );
};
```

*Nhờ kiến trúc `RouterWrapper` sử dụng `useInRouterContext()`, `user-mfe` sẽ tự động phát hiện nó đang chạy lồng trong Router của Shell và sẽ không sinh thêm thẻ `<BrowserRouter>` trùng lặp.*

---

## 🐳 Triển khai với Docker & Nginx Production

Ứng dụng đã được tích hợp sẵn Dockerfile đa tầng và máy chủ Nginx được cấu hình tối ưu hiệu năng và xử lý CORS.

1. **Build Docker Image**:
   ```bash
   docker build -t lumina-user-mfe:1.0 .
   ```

2. **Khởi chạy container**:
   ```bash
   docker run -d -p 3003:3003 --name lumina-user-mfe-container lumina-user-mfe:1.0
   ```
   Ứng dụng sẽ được phục vụ ổn định trên cổng `3003`. File `nginx.conf` đã kích hoạt sẵn header `Access-Control-Allow-Origin *` để Shell App có thể nạp các chunk Javascript từ container này một cách an toàn.

---

## ⚡ API Endpoint Danh mục

Khi thực hiện các thao tác CRUD, ứng dụng sẽ gửi yêu cầu trực tiếp qua API Gateway và tự gắn header `Authorization: Bearer <token>` từ `auth_access_token` trong cookie/localStorage:
- **Lấy danh sách người dùng**: `GET /users` (hoặc lọc theo `GET /users?email=...`)
- **Xem thông tin chi tiết**: `GET /users/:id`
- **Tạo người dùng mới**: `POST /users`
- **Cập nhật thông tin**: `PUT /users/:id`
- **Xóa người dùng (soft-delete)**: `DELETE /users/:id`
