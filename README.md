# Spam Email Classifier - Phân loại Email Spam

Dự án này bao gồm một mô hình phân loại email spam sử dụng Machine Learning và một Chrome Extension để phân tích email trực tiếp trên Gmail.

## 🚀 Cách chạy Backend (Model API)

### Yêu cầu hệ thống
- Python 3.7 trở lên
- pip (Python package manager)

### Bước 1: Cài đặt dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Bước 2: Chuẩn bị dữ liệu
Đảm bảo file `combined_data.csv` có trong thư mục `backend/`. Nếu chưa có, model sẽ tự động tạo file này từ `spam.csv` khi chạy lần đầu.

### Bước 3: Chạy server
```bash
python app.py
```

Server sẽ chạy tại: `http://localhost:42069`

### API Endpoints

#### 1. Phân loại email spam
- **Endpoint**: `POST /predict`
- **Body**:
```json
{
    "text": "Nội dung email cần phân loại"
}
```
- **Response**:
```json
{
    "is_spam": true,
    "confidence": 0.95,
    "label": "spam"
}
```

#### 2. Phân tích tần suất từ khóa
- **Endpoint**: `POST /analyze_word_frequency`
- **Body**:
```json
{
    "word_count": 100,
    "target_word": "free",
    "base_text": "This is a sample email"
}
```

## 🔧 Cách cài đặt Chrome Extension

### Bước 1: Mở Chrome Extension Manager
1. Mở Chrome browser
2. Vào `chrome://extensions/`
3. Bật "Developer mode" ở góc trên bên phải

### Bước 2: Load extension
1. Click "Load unpacked"
2. Chọn thư mục `spam_classifier_extension`
3. Extension sẽ xuất hiện trong danh sách extensions

### Bước 3: Sử dụng extension
1. **Đảm bảo backend đang chạy** tại `localhost:42069`
2. Mở Gmail (`mail.google.com`)
3. Click vào icon extension trên thanh toolbar
4. Nhập nội dung email vào popup và click "Classify"

## 📱 Cách sử dụng

### Phân loại email qua Extension
1. Mở email trong Gmail
2. Copy nội dung email
3. Click vào icon Spam Classifier trên toolbar Chrome
4. Paste nội dung vào textbox
5. Click "Classify Email" để nhận kết quả

### Phân tích tần suất từ khóa
1. Click vào icon extension
2. Chuyển sang tab "Word Frequency Analysis"
3. Nhập từ khóa muốn phân tích
4. Nhập số lượng từ và nội dung cơ bản
5. Click "Analyze" để xem kết quả

## 🛠️ Cấu trúc dự án

```
SpamDetectorExtension/
├── backend/                    # Backend API
│   ├── app.py                 # Flask server chính
│   ├── model.py               # Training model script
│   ├── requirements.txt       # Python dependencies
│   ├── spam.csv              # Dữ liệu training
│   └── combined_data.csv     # Dữ liệu đã xử lý
│
└── spam_classifier_extension/ # Chrome Extension
    ├── manifest.json         # Extension config
    ├── popup.html           # UI popup
    ├── popup.js            # Logic popup
    ├── content.js          # Content script cho Gmail
    └── images/             # Icons
```

## 🔍 Troubleshooting

### Backend không chạy được
- Kiểm tra Python version: `python --version`
- Cài đặt lại dependencies: `pip install -r requirements.txt`
- Kiểm tra port 42069 có bị chiếm dụng không

### Extension không hoạt động
- Đảm bảo backend đang chạy tại `localhost:42069`
- Kiểm tra Developer mode đã bật trong Chrome
- Reload extension trong Chrome Extensions page
- Kiểm tra console log trong Chrome DevTools

### Lỗi CORS
- Backend đã có CORS enabled, nếu vẫn lỗi thì restart server
- Kiểm tra URL trong extension có đúng `localhost:42069` không

## 📋 Features

- ✅ Phân loại email spam/ham với độ chính xác cao
- ✅ Tích hợp trực tiếp với Gmail qua Chrome Extension
- ✅ Phân tích tần suất từ khóa ảnh hưởng đến spam score
- ✅ API RESTful cho tích hợp với các ứng dụng khác
- ✅ Real-time classification

## 📊 Dataset

Dự án này sử dụng dataset từ Kaggle để huấn luyện mô hình phân loại email spam. Bạn có thể tải dataset từ liên kết sau:

[Email Spam Classification Dataset](https://www.kaggle.com/datasets/purusinghvi/email-spam-classification-dataset)

Dataset này bao gồm các email được gán nhãn là spam hoặc ham, giúp mô hình học cách phân loại email dựa trên nội dung của chúng.

