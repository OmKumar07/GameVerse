# 🏓 Keep Server Alive - Complete Guide

This guide explains how to prevent your GameVerse backend server from going to sleep on free hosting platforms.

## 🚨 The Problem

Free hosting services like Railway, Heroku, Render, and others put your server to sleep after 30 minutes of inactivity to save resources. This means:

- First request after sleep takes 10-30 seconds (cold start)
- Poor user experience
- Potential timeout errors

## ✅ Solutions Implemented

### 1. Built-in Self-Ping Mechanism

Your server now includes a built-in keep-alive system that pings itself every 30 minutes in production.

**Environment Variables Needed:**

```env
NODE_ENV=production
SERVER_URL=https://your-backend-url.railway.app
```

### 2. External Monitoring Services (Recommended)

#### 🌟 **UptimeRobot** (Free - Recommended)

- **URL**: https://uptimerobot.com
- **Free Plan**: 50 monitors, 5-minute intervals
- **Setup**:
  1. Create account
  2. Add "HTTP(s)" monitor
  3. URL: `https://your-backend-url.railway.app/api/keep-alive`
  4. Interval: 5 minutes
  5. Enable notifications

#### 🌟 **Pingdom** (Free)

- **URL**: https://www.pingdom.com
- **Free Plan**: 1 monitor, 1-minute intervals
- **Setup**: Similar to UptimeRobot

#### 🌟 **Better Uptime** (Free)

- **URL**: https://betteruptime.com
- **Free Plan**: 10 monitors, 3-minute intervals
- **Setup**: Similar to UptimeRobot

#### 🌟 **Freshping** (Free)

- **URL**: https://www.freshworks.com/website-monitoring/
- **Free Plan**: 50 monitors, 1-minute intervals
- **Setup**: Similar to UptimeRobot

### 3. GitHub Actions (Free with GitHub)

Create `.github/workflows/keep-alive.yml`:

```yaml
name: Keep Server Alive
on:
  schedule:
    - cron: "*/30 * * * *" # Every 30 minutes
  workflow_dispatch: # Manual trigger

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Server
        run: |
          curl -f https://your-backend-url.railway.app/api/keep-alive || exit 1
```

### 4. Frontend Keep-Alive (Lightweight)

Add this to your React app to ping when users are active:

```javascript
// In your main App.tsx or a custom hook
useEffect(() => {
  const keepAlive = () => {
    fetch(`${process.env.VITE_API_URL}/api/keep-alive`).catch((err) =>
      console.log("Keep-alive ping failed:", err)
    );
  };

  // Ping on app load
  keepAlive();

  // Ping every 30 minutes if user is active
  const interval = setInterval(() => {
    if (!document.hidden) {
      keepAlive();
    }
  }, 30 * 60 * 1000);

  return () => clearInterval(interval);
}, []);
```

## 🛡️ Security Considerations

### ✅ Safe Practices:

- ✅ Using dedicated keep-alive endpoints
- ✅ Rate limiting is in place
- ✅ Minimal resource usage
- ✅ Only runs in production
- ✅ External services are legitimate monitoring tools

### ❌ What to Avoid:

- ❌ Don't ping database-heavy endpoints
- ❌ Don't ping authentication endpoints
- ❌ Don't use malicious ping services
- ❌ Don't ping too frequently (< 5 minutes)

## 🚀 Deployment Setup

### Railway Environment Variables:

```env
NODE_ENV=production
SERVER_URL=https://gameverse-backend-production.up.railway.app
MONGODB_URI=mongodb+srv://...
```

### Heroku Environment Variables:

```env
NODE_ENV=production
SERVER_URL=https://gameverse-backend.herokuapp.com
MONGODB_URI=mongodb+srv://...
```

### Render Environment Variables:

```env
NODE_ENV=production
SERVER_URL=https://gameverse-backend.onrender.com
MONGODB_URI=mongodb+srv://...
```

## 📊 Monitoring & Analytics

Your server now logs keep-alive pings:

- ✅ `🏓 Keep-alive ping successful: 200`
- ❌ `🔴 Keep-alive ping failed: [error]`
- ⏰ `🔴 Keep-alive ping timeout`

## 🎯 Recommended Setup

**For Production:**

1. **Primary**: UptimeRobot (5-minute intervals)
2. **Backup**: Built-in self-ping (30-minute intervals)
3. **Optional**: GitHub Actions (30-minute intervals)

**For Development:**

- Keep-alive is automatically disabled in development mode

## 💡 Pro Tips

1. **Multiple Monitors**: Use 2-3 different services for redundancy
2. **Different Intervals**: Stagger timing to avoid conflicts
3. **Health Checks**: Monitor both `/api/health` and `/api/keep-alive`
4. **Notifications**: Set up alerts for downtime
5. **Analytics**: Track uptime statistics

## 🔧 Troubleshooting

### Server Still Sleeping?

1. Check environment variables are set correctly
2. Verify SERVER_URL is accessible
3. Check hosting platform logs
4. Ensure keep-alive endpoints return 200 status

### Too Many Requests?

1. Increase ping intervals
2. Use fewer monitoring services
3. Check rate limiting configuration

### High Resource Usage?

1. Use lightweight endpoints only
2. Avoid database queries in keep-alive
3. Monitor server metrics

## 📈 Expected Results

- **Uptime**: 99%+ instead of ~70%
- **Response Time**: <500ms instead of 10-30s cold starts
- **User Experience**: Instant API responses
- **Reliability**: Consistent performance

---

## 🎯 Quick Setup Checklist

- [ ] Add environment variables to hosting platform
- [ ] Deploy updated server code
- [ ] Set up UptimeRobot monitor
- [ ] Test keep-alive endpoint manually
- [ ] Monitor logs for successful pings
- [ ] Set up backup monitoring service (optional)

**Your GameVerse backend should now stay awake 24/7! 🚀**
