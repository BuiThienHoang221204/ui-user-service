# Giải thích lỗi Mixed Content (HTTPS vs HTTP)

## 1. Nguyên nhân lỗi
Giao diện của bạn được deploy trên Vercel (`https://ui-user-service.vercel.app`) sử dụng giao thức bảo mật **HTTPS**. Tuy nhiên, API backend của bạn (`http://13.239.122.251:3001`) lại sử dụng **HTTP**.

Trình duyệt hiện đại có chính sách bảo mật chặn tất cả các yêu cầu "không an toàn" (HTTP) từ một trang web "an toàn" (HTTPS). Đây gọi là lỗi **Mixed Content**.

*   **Tại sao Postman thành công?** Postman là một công cụ test API, không phải trình duyệt web, nên nó không áp dụng các chính sách bảo mật khắt khe như Chrome hay Edge.

## 2. Giải pháp khuyên dùng (Long-term)
Bạn nên cấu hình SSL (HTTPS) cho backend của mình trên EC2. Có 2 cách phổ biến:
- **Cách A**: Sử dụng Cloudflare làm Proxy (nhanh nhất).
- **Cách B**: Cài đặt Nginx trên EC2 và dùng Certbot/Let's Encrypt để lấy chứng chỉ SSL miễn phí.

## 3. Giải pháp tạm thời (Để test app)
Để tiếp tục phát triển mà không bị chặn, bạn có thể thực hiện một trong các cách sau:

### Cách 1: Cho phép Mixed Content trên trình duyệt (Chỉ áp dụng cho máy của bạn)
1. Click vào icon **Ổ khóa** (hoặc dấu chấm than) ở thanh địa chỉ trình duyệt.
2. Chọn **Site settings** (Cài đặt trang web).
3. Tìm mục **Insecure content** và chuyển thành **Allow** (Cho phép).
4. Load lại trang.

### Cách 2: Sử dụng Proxy Reverse trong `.vercel.json` (Khuyên dùng cho Vercel)
Bạn có thể cấu hình Vercel để nó đóng vai trò là "người trung gian" chuyển tiếp request.
Tạo file `vercel.json` ở thư mục gốc:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "http://13.239.122.251:3001/:path*"
    }
  ]
}
```

Sau đó, chỉnh sửa `src/shared/api/axiosClient.ts` để gọi API qua `/api`:
```typescript
const baseURL = '/api';
```

### Cách 3: Chạy giao diện ở Local (HTTP)
Nếu bạn chạy giao diện ở localhost (thường là `http://localhost:5173`), lỗi này sẽ không xảy ra vì cả hai đều là HTTP.
