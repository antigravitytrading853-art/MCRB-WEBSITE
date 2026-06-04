# Meru County Revenue Board - Navigation Layout Upgrade

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Meru County Revenue Board</title>

<style>
:root{
    --primary:#2E7D32;
    --secondary:#1B5E20;
    --accent:#66BB6A;
    --light:#F5F7FA;
    --dark:#1E293B;
}

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    font-family:Inter,Segoe UI,sans-serif;
    background:#f5f7fa;
    overflow-x:hidden;
}

/* Existing homepage remains visible behind navigation */
.hero-wrapper{
    min-height:100vh;
    background:url('your-current-hero-image.jpg') center center/cover no-repeat;
    position:relative;
}

.hero-wrapper::before{
    content:'';
    position:absolute;
    inset:0;
    background:rgba(0,0,0,.35);
}

/* Floating Navigation */
.sidebar{
    position:fixed;
    left:20px;
    top:20px;
    bottom:20px;
    width:280px;

    background:rgba(46,125,50,.92);
    backdrop-filter:blur(12px);

    border-radius:28px;

    box-shadow:
    0 10px 30px rgba(0,0,0,.20);

    display:flex;
    flex-direction:column;

    z-index:1000;
}

.logo-section{
    padding:28px 24px;
    color:white;
    border-bottom:1px solid rgba(255,255,255,.15);
}

.logo-section h2{
    font-size:1.3rem;
    line-height:1.3;
}

.nav-links{
    padding:20px;
    flex:1;
}

.nav-links a{
    display:flex;
    align-items:center;
    gap:12px;

    color:white;
    text-decoration:none;

    padding:14px 16px;
    margin-bottom:8px;

    border-radius:14px;

    transition:.25s;
}

.nav-links a:hover{
    background:rgba(255,255,255,.15);
}

.nav-links a.active{
    background:white;
    color:var(--primary);
    font-weight:600;
}

.login-panel{
    padding:20px;
    border-top:1px solid rgba(255,255,255,.15);
}

.login-btn{
    display:block;
    text-align:center;

    text-decoration:none;
    color:var(--primary);

    background:white;

    padding:14px;
    border-radius:14px;

    font-weight:600;
}

/* Content stays exactly as current homepage */
.main-content{
    margin-left:330px;
    position:relative;
    z-index:10;
}

.topbar{
    position:sticky;
    top:20px;

    margin:20px;

    background:rgba(255,255,255,.85);
    backdrop-filter:blur(10px);

    border-radius:20px;

    padding:18px 24px;

    display:flex;
    justify-content:space-between;
    align-items:center;

    box-shadow:0 6px 20px rgba(0,0,0,.08);
}

.search-box{
    width:60%;
}

.search-box input{
    width:100%;
    border:none;
    outline:none;

    background:#f5f7fa;

    padding:14px 18px;

    border-radius:12px;
}

.page-content{
    padding:20px;
}

/*
Paste ALL existing homepage sections below
unchanged:

- Hero section
- Statistics section
- Services section
- Calculator section
- MeruPay section
- Contact section
- Footer

Only the navigation changes.
*/
</style>
</head>

<body>

<div class="sidebar">

    <div class="logo-section">
        <h2>MERU COUNTY<br>REVENUE BOARD</h2>
    </div>

    <div class="nav-links">

        <a class="active" href="#home">Home</a>

        <a href="#services">Services</a>

        <a href="#calculator">Calculator</a>

        <a href="#portal">MeruPay Portal</a>

        <a href="#contact">Contact</a>

        <a href="#about">About</a>

    </div>

    <div class="login-panel">
        <a href="#login" class="login-btn">Login</a>
    </div>

</div>

<div class="main-content">

    <div class="topbar">

        <div class="search-box">
            <input
                type="text"
                placeholder="Search permits, invoices, services...">
        </div>

        <div>
            Notifications | Profile
        </div>

    </div>

    <div class="page-content">

        <!--
        PASTE YOUR EXISTING HOMEPAGE CONTENT HERE.
        DO NOT CHANGE THE CURRENT SECTIONS.
        -->

    </div>

</div>

</body>
</html>
```
