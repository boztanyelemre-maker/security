# MVP (Minimum Viable Product) — Proje tanımı

**MVP = Asgari Uygulanabilir Ürün.** Vizyonu bozmadan, gerçek kullanıcıyla test edilebilecek en sade, en gerekli hali.

---

## MVP’nin 3 kuralı (bu proje için)

| # | Kural | Bu projede |
|---|--------|-------------|
| 1 | **Gerçek bir problemi çözer mi?** | Evet: Alıcı güvenilir güvenlik firması bulur; sağlayıcı doğru işe ulaşır. |
| 2 | **Çekirdek akış uçtan uca çalışıyor mu?** | Kayıt → Rol seç → Giriş → Alıcı talep açar → Sağlayıcı uygun talebi görür → Teklif verir → Alıcı teklifleri değerlendirir. Bu akış çalışıyorsa MVP vardır. |
| 3 | **Gerçek kullanıcıdan öğrenme var mı?** | Kim kayıt oluyor, talep açabiliyor mu, sağlayıcı teklif verebiliyor mu, nerede takılıyorlar? MVP’nin amacı öğrenmektir. |

---

## Bu projede MVP’ye dahil olanlar

- Kayıt ol + rol seçimi (Alıcı / Sağlayıcı)
- Giriş yap (role göre yönlendirme)
- Alıcı talep oluşturma (bütçe gizli)
- Sağlayıcı uygun talepleri görme (“uygun / uygun değil”)
- Teklif verme
- Admin: alıcı ve sağlayıcıyı listeleme, detay, pasife al/aktif et

---

## MVP’ye dahil olmayanlar (şimdilik — v2/v3)

- Chat / anlık mesajlaşma
- Açık pazarlık / fiyat kırdırma
- Otomatik fiyat karşılaştırma
- Puanlama / yorum sistemi
- Ödeme / komisyon entegrasyonu

Bunlar v2 / v3 konuları.

---

## MVP ≠ Demo

- **Demo:** Sadece gösterilir.
- **MVP:** Kullanılır. Bir alıcı gerçekten talep açabiliyor mu? Bir sağlayıcı gerçekten teklif verebiliyor mu? Bunlar çalışıyorsa MVP var.

---

## Vizyon kontrolü

MVP tanımı bu projede:

- “En ucuz teklif” mantığına veya ihale mantığına **düşmüyor**.
- Kalite + uygunluk **test ediliyor**.
- Vizyonla uyumlu.

---

## Tek cümlelik tanım

**MVP, ürünü büyütmek için değil; doğru ürünü yapıp yapmadığını anlamak için çıkarılır.**

---

## Ekran sayıları (MVP vs v2)

- **MVP = 15 ekran:** Public 1–5, Alıcı çekirdek 6–8, Sağlayıcı çekirdek 10–13, Admin minimum 15–18. Çekirdek akış + kim kullanıyor / kalite var mı.
- **v2 = 8 ekran:** 9 (Alıcı Profil), 14 (Tekliflerim), 19–23 (Admin detay, Talepler, Teklifler, İnceleme Kuyruğu). Ölçek, kalite, denetim.

Detay: [docs/SCREEN-INVENTORY.md](SCREEN-INVENTORY.md).
