# Copy Trading Api

With NodeJS/Typescript/Express/Mongoose

## I. Cài đặt

### 1. Cài đặt plugin

```
yarn install
```

### 2. Chạy ở môi trường development

```
- Thêm các tham số cần thiết vào file .vscode/launch.json, các tham số tham khảo trong file.env.example
- Nhấn F5 ở trên vscode để khởi chạy chế độ Debug trên môi trường dev
```

### 3. Xây dựng môi trường Production (hoặc test)

```
- Tạo ra file .env.production (với môi trường test là file .env.test)
  bao gồm các tham số tham khảo trong file.env.example
- Chạy lệnh: yarn build:prod - Nếu muốn build cả APIDoc thì chạy lệnh: yarn build
```

### 4. Lints and fixes files

```
yarn lint
```

## II. Một số lưu ý

### 1. Database MongoDB

- Khi tạo một collection (schema) mới thì cần có tiền tố đầu là cp\_(tên collection)
- cp\_: đại diện cho các bảng thuộc về hệ thống copy trading
- Tuyệt đối không xóa các bảng khác trong Database

## III. Template khi tạo pull request để review

### 1. Description

Xây dựng structure Back-End

- Sử dụng NodeJS, Express, Mongoose
- Cơ sở dữ liệu MongoDB
- Sử dụng TypeScript trong dự án

### 2. Trello task

https://app.asana.com/0/1186125307792483/1186125307792403/f

### 3. Packages added

- N/A

### 4. Note

- N/A
