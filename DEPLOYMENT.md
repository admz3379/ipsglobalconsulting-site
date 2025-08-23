# iPS Consulting Website - Deployment Guide

## 📁 Files Ready for Download & GitHub Deployment

Your iPS Consulting website is ready for deployment to your existing domain via GitHub. Here's everything included:

### 🗂️ **Complete File Structure**
```
iPS-Consulting-Website/
├── index.html              # Main website (complete)
├── thank-you.html          # Form confirmation page
├── css/
│   └── style.css          # Brand color system & styling
├── js/
│   └── main.js           # Interactive functionality
├── README.md             # Documentation
└── DEPLOYMENT.md         # This deployment guide
```

## 🚀 **GitHub Pages Deployment Steps**

### **Step 1: Download Files**
Download all files from this project to your local machine.

### **Step 2: Create/Update GitHub Repository**
1. Go to your GitHub account
2. Create new repository or use existing one
3. Upload all website files to the repository
4. Ensure `index.html` is in the root directory

### **Step 3: Enable GitHub Pages**
1. Go to your repository **Settings**
2. Scroll to **Pages** section
3. Under **Source**, select **Deploy from a branch**
4. Choose **main** branch and **/ (root)** folder
5. Click **Save**

### **Step 4: Configure Custom Domain**
1. In the **Pages** settings, add your **Custom domain**
2. GitHub will create a `CNAME` file automatically
3. Check **Enforce HTTPS** (recommended)

### **Step 5: DNS Configuration**
Update your domain's DNS settings:
- **CNAME Record**: Point `www` to `[your-username].github.io`
- **A Records**: Point root domain to GitHub Pages IPs:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`

## 📧 **Contact Form Configuration**

### **For GitHub Pages:**
The form uses a smart fallback system:
- **Primary**: Opens user's email client with pre-filled message to info@ipsglobalconsulting.com
- **Backup**: Displays direct email address for manual contact

### **For Enhanced Form Handling (Optional):**
If you want server-side form processing:
1. **Netlify**: Move to Netlify hosting for built-in form handling
2. **Formspree**: Add Formspree endpoint to form action
3. **EmailJS**: Client-side email service integration

## ✅ **Pre-Deployment Checklist**

- [ ] All files downloaded from project
- [ ] GitHub repository created/updated
- [ ] Custom domain configured in GitHub Pages
- [ ] DNS records updated
- [ ] SSL certificate enabled
- [ ] Test contact form functionality
- [ ] Verify all links work correctly
- [ ] Check mobile responsiveness

## 🎨 **Brand Colors Reference**
Your website uses the official iPS brand color system:
- **Primary**: Deep Blue `#1E3A8A` (Technology & Trust)
- **Secondary**: Emerald Green `#059669` (Transformation & Growth)  
- **Accent**: Burnt Orange `#EA580C` (Risk & Alert)
- **Text**: Charcoal Grey `#374151` (Advisory & Authority)
- **Background**: Cool Grey `#F3F4F6` (Professional backgrounds)

## 🔧 **Performance Optimization (Post-Deployment)**

For production optimization:
1. **Replace Tailwind CDN** with local build
2. **Minimize CSS/JS files** 
3. **Optimize images** (if you add any later)
4. **Enable caching** via GitHub Pages headers

## 📞 **Contact Information**
- **Email**: info@ipsglobalconsulting.com
- **Phone**: +1 (301) 259-1067
- **Address**: 11133 Shady Trail, Dallas, TX 75229
- **License**: #805961271

## 🚨 **Important Notes**

1. **Form Submissions**: Will open user's email client or show direct email address
2. **Analytics**: Consider adding Google Analytics after deployment
3. **Updates**: Any changes to files require re-uploading to GitHub
4. **Backup**: Keep local copies of all customized files

Your website is professionally designed and ready for immediate deployment! 🎉