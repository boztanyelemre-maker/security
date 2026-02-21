# Tasarım → Kodlama sırası (karar)

**Karar:** Bu aşamadan sonra önce **tasarım**, sonra **kodlama**. İkisi de gelecek; sıra önemli.

---

## Neden önce tasarım?

1. **Akış karmaşık:** Rol bazlı (alıcı/sağlayıcı/admin), gizli bütçe, “ihaleleşmemesi” gereken hassas noktalar — bunlar ekranda doğru değilse kod ne kadar iyi olursa olsun ürün yanlış olur.
2. **Tasarım = ürün kararı:** Hangi alan var/yok, hangi buton nerede, kullanıcı neyi ne zaman görüyor; bunlar netleşmeden kod “sonradan düzeltiriz” bataklığına iter.
3. **Tasarım kodu hızlandırır:** Net Figma ile endpoint’ler sabit kalır, frontend hızlı ilerler, admin sürpriz çıkarmaz.

**Vizyon kontrolü:** “Önce kodlayalım” bu projede stratejik olarak yanlış; önce tasarım doğru, güvenli ve ölçeklenebilir sıra.

Bu yüzden ideal akış: **Tasarım (Figma) finalize → paralelde API/DB sözleşmesi → Kodlama.**

---

## Adımlar (özet)

| Sıra | Adım | İçerik |
|------|------|--------|
| 1 | **Tasarım (Figma)** | 15 MVP ekranı; field-by-field; component set; tıklanabilir prototype |
| 2 | **Paralel** | API kontratı + DB migration (endpoint listesi, 8 tablo, RBAC) |
| 3 | **Kodlama** | Auth + RBAC → Buyer → Provider → Admin listeleri |

---

## Pratik öneri

- **Önce 2 günlük tasarım sprinti** (MVP ekranları + prototype).
- **Aynı anda 1 günlük API/DB sözleşmesi** (kontrat + migration taslağı).
- **Sonra kodlama** — hem hız hem vizyon çizgisi korunur.

---

*Referans: [FIGMA-MVP-SIRASI.md](FIGMA-MVP-SIRASI.md), [API-KONTRAT-SABLONU.md](API-KONTRAT-SABLONU.md).*
