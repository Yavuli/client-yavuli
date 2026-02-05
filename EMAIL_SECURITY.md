# 📧 Email Security Guide (SPF, DKIM, DMARC)

To prevent attackers from spoofing emails from the **@yavuli.app** domain, you need to configure three critical DNS TXT records in your domain provider's dashboard (e.g., Namecheap, Cloudflare, GoDaddy).

---

## 1. SPF (Sender Policy Framework)
Tells receiving servers which mail servers are authorized to send email on your behalf.

**Record Type:** `TXT`  
**Host/Name:** `@` (or leave blank)  
**Value:** `v=spf1 include:_spf.google.com ~all`  
*(Note: Replace `_spf.google.com` if you use a different provider like Outlook or Resend)*

---

## 2. DKIM (DomainKeys Identified Mail)
Adds a digital signature to your emails so they can be verified as authentic.

**Record Type:** `TXT`  
**Host/Name:** `google._domainkey` (or as provided by your mail service)  
**Value:** *(Go to your Email Provider's Admin Panel -> DKIM Settings -> Generate new record. Copy the long public key string here)*

---

## 3. DMARC (Domain-based Message Authentication, Reporting & Conformance)
Tells servers what to do if an email fails SPF or DKIM checks.

**Record Type:** `TXT`  
**Host/Name:** `_dmarc`  
**Value:** `v=DMARC1; p=quarantine; rua=mailto:admin@yavuli.app`  

### Policy Levels (`p=`):
- `p=none`: (Monitoring mode) No action taken on failure. Use this for the first 2 weeks.
- `p=quarantine`: Moves failed emails to Spam/Junk folder.
- `p=reject`: Completely blocks failed emails. (Most secure)

---

## ✅ How to Verify
After adding these records, visit [EasyDMARC Domain Scanner](https://easydmarc.com/tools/domain-scanner) and enter `yavuli.app` to confirm they are active.
