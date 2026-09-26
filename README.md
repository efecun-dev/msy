# MSY Elektronik - B2B Teklif & Ürün Yönetim Sistemi

Bu proje, MSY Elektronik için geliştirilmiş, Next.js 15 (App Router), TailwindCSS ve Prisma (SQLite) kullanılarak inşa edilmiş modern bir kurumsal web sitesi ve yönetim panelidir.

## Özellikler

- 🛍️ **Dinamik Ürün Kataloğu:** Sepete (Teklif Listesine) ürün ekleme ve miktar belirleme.
- 📝 **Teklif Sistemi:** Müşterilerin seçtikleri ürünlerle teklif talebi oluşturabilmesi.
- 🔒 **Güvenli Yönetim Paneli:** NextAuth ile korunan admin paneli.
- 📊 **Raporlar ve İstatistikler:** Gelen teklifleri inceleme, yazdırma (PDF/Print) ve ciro analizi.
- 📩 **İletişim Formu:** Müşterilerden gelen mesajların doğrudan panele düşmesi.
- 🔔 **Akıllı Bildirimler:** Bekleyen teklifler ve okunmamış mesajlar için uyarı sistemi.
- 🚀 **SEO & Performans:** Dinamik sitemap.xml, robots.txt, OpenGraph ve JSON-LD yapısal verileri.

---

## 🚀 VPS Sunucusuna Kurulum Rehberi (Production)

Bu rehber, projeyi **Ubuntu 22.04 / 24.04** işletim sistemli bir VPS sunucusuna (ör: DigitalOcean, Hetzner, Vultr, AWS) sıfırdan kurmanızı sağlar.

### 1. Sunucu Ön Hazırlıkları

Sunucunuza SSH ile bağlandıktan sonra temel güncellemeleri yapın ve gerekli paketleri kurun:

```bash
# Sistem güncellemeleri
sudo apt update && sudo apt upgrade -y

# Node.js, npm, git ve nginx kurulumu
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx certbot python3-certbot-nginx

# Kurulumları doğrulama
node -v
npm -v
```

### 2. Projenin Sunucuya Çekilmesi

Projenizi sunucuda `/var/www` dizininde barındırmak en yaygın standarttır.

```bash
cd /var/www
# Projenizi GitHub/GitLab üzerinden klonlayın (Örnek URL'i kendi reponuzla değiştirin)
sudo git clone https://github.com/KULLANICI_ADINIZ/msy-elektronik.git msy-app
cd msy-app

# Dosya yetkilerini ayarlama (kendi linux kullanıcınıza yetki verin)
sudo chown -R $USER:$USER /var/www/msy-app
```

### 3. Çevre Değişkenleri (.env) Ayarları

Sunucuda projenin kök dizininde `.env` dosyasını oluşturun:

```bash
nano .env
```

İçine aşağıdaki bilgileri kendi domaininize ve şifrenize göre doldurun:

```env
# Veritabanı (SQLite kullanıyoruz)
DATABASE_URL="file:./dev.db"

# Güvenlik ve Auth
# Rastgele bir güvenlik anahtarı oluşturmak için terminalde 'openssl rand -base64 32' yazabilirsiniz.
NEXTAUTH_SECRET="BURAYA_GIZLI_BIR_SIFRE_YAZIN"
NEXTAUTH_URL="https://sitenizindomaini.com"

# Yönetici Giriş Bilgileri
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="cok_guclu_bir_sifre"
```

_(Dosyayı kaydetmek için `CTRL+O` -> `Enter` -> `CTRL+X` yapın.)_

### 4. Bağımlılıkların Kurulması ve Veritabanı

```bash
# Paketleri yükleyin
npm install

# Veritabanı tablolarını oluşturun (SQLite dosyanız oluşacak)
npx prisma db push

# (İsteğe bağlı) Eğer ilk kurulumda örnek veriler veya admin kullanıcı ekleyen bir seed dosyanız varsa:
npx prisma db seed

# Prisma Client'ı oluşturun
npx prisma generate
```

> **ÖNEMLİ (SQLite Hakkında):** SQLite dosyası `prisma/dev.db` içinde tutulur. Uygulamayı güncelleyip yeniden `git pull` yaptığınızda bu dosyanın silinmemesi/üzerine yazılmaması için repoda `.gitignore` dosyasına ekli olduğundan emin olun.

### 5. Projeyi Derleme (Build)

Uygulamayı canlı yayına hazır hale getirmek için derleyin:

```bash
npm run build
```

### 6. PM2 ile Uygulamayı Sürekli Çalışır Hale Getirme

Sunucu yeniden başlasa bile sitenizin açık kalması için `pm2` kullanacağız:

```bash
# PM2'yi global olarak kurun
sudo npm install -g pm2

# Next.js uygulamasını başlatın
pm2 start npm --name "msy-app" -- run start

# PM2'yi sunucu başlangıcında (boot) otomatik çalışacak şekilde ayarlayın
pm2 startup
# (Çıkan komutu kopyalayıp terminale yapıştırın ve çalıştırın)

# PM2 listesini kaydedin
pm2 save
```

### 7. Nginx ve Domain (Reverse Proxy) Ayarları

Domain adresinizi VPS sunucunuzun IP adresine yönlendirdiğinizden emin olun (DNS kayıtlarından A kaydı olarak ekleyin). Ardından Nginx'i ayarlayalım:

```bash
# Nginx konfigürasyon dosyasını oluşturun
sudo nano /etc/nginx/sites-available/msy-app
```

İçine aşağıdakileri yapıştırın (`sitenizindomaini.com` kısımlarını kendi domaininizle değiştirin):

```nginx
server {
    listen 80;
    server_name sitenizindomaini.com www.sitenizindomaini.com;

    location / {
        proxy_pass http://localhost:3000; # Next.js'in çalıştığı port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # Gerçek IP adreslerini Next.js'e iletmek için
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Ayarı aktifleştirin
sudo ln -s /etc/nginx/sites-available/msy-app /etc/nginx/sites-enabled/

# Nginx ayarlarında hata var mı kontrol edin
sudo nginx -t

# Nginx'i yeniden başlatın
sudo systemctl restart nginx
```

Siteniz artık HTTP üzerinden yayında! (http://sitenizindomaini.com)

### 8. SSL Sertifikası Kurulumu (HTTPS)

Sitenizi güvenli (HTTPS) hale getirmek ve tarayıcılardaki "Güvenli Değil" uyarısını kaldırmak için Certbot kullanıyoruz:

```bash
# SSL sertifikasını alın (Nginx yapılandırmasını otomatik güncelleyecektir)
sudo certbot --nginx -d sitenizindomaini.com -d www.sitenizindomaini.com
```

Sertifika kurulumu sırasında sizden bir e-posta adresi isteyecek ve koşulları kabul etmenizi talep edecektir. Kurulum bitince HTTPS yönlendirmesinin (redirect) yapılmasını seçin (Seçenek 2).

---

🎉 **Tebrikler!** MSY Elektronik sistemi artık canlıda ve tamamen kullanıma hazır.
Admin paneline `https://sitenizindomaini.com/dashboard/login` adresinden `.env` dosyasında belirlediğiniz bilgilerle giriş yapabilirsiniz.

## Güncelleme Yapmak İsterseniz

İleride kodda değişiklik yapıp sunucuyu güncellemek istediğinizde sırasıyla:

```bash
cd /var/www/msy-app
git pull
npm install
npx prisma generate
npx prisma db push
npm run build
pm2 restart msy-app
```

adımlarını izlemeniz yeterlidir.
