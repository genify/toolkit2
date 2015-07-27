<#-- Created by zmm on 20/11/14. -->
<#-- error跳转页面：/error-->

<html lang="en">
<head>
    <title>Error_网易海淘</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <link rel="shortcut icon" href="/favicon.ico"/>
    <!-- @NOPARSE -->
    <link href="http://fonts.googleapis.com/css?family=Creepster" rel="stylesheet" type="text/css">
    <!-- /@NOPARSE -->
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        body {
            font-family: arial, helvetica, sans-serif;
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAUElEQVQYV2NkYGAwBuKzQAwDID4IoIgxIikAMZE1oRiArBDdZBSNMIXoJiFbDZYDKcSmCOYimDuNSVKIzRNYrUYOFuQgweoZbIoxgoeoAAcAEckW11HVTfcAAAAASUVORK5CYII=) repeat;
            background-color: #212121;
            color: white;
            font-size: 28px;
            padding-bottom: 20px;
        }
        .error-code {
            font-family: 'Creepster', arial, helvetica, sans-serif;
            font-size: 100px;
            color: #7d0d0a;
            color: rgba(255, 255, 255, 0.98);
            text-align: center;
            margin-top: 5%;
            margin-bottom:20px;
            text-shadow: 5px 5px hsl(0, 0%, 25%);
        }
        .clear {
            float: none;
            clear: both;
        }
        .content {
            text-align: center;
            line-height: 30px;
            font-family: 'Creepster', cursive, arial, helvetica, sans-serif;
        }
        .content p{
            margin-bottom: 10px;
        }
        a {
            text-decoration: none;
            color: #008000;
            text-shadow: 0px 0px 1px #fff;
            margin-right: 50px;
        }
        a:hover {
            color: #9ECDFF;
        }
        a.login {
            display: block;
            margin-top: 20px;
            margin-right: 15px;
            font-size: 20px;
            text-shadow: 0 0 1px #F7A;
        }
        span {
            -webkit-animation: twinkling 2s infinite ease-in-out;
        }
        @-webkit-keyframes twinkling{
            0%{
                color: #FF0000;
                opacity:1;
            }
            50%{
                opacity:0.5;
                color: #750A0D;
            }
            100%{
                color: #FF0000;
                opacity:1;
            }
        }
    </style>
</head>

<body>
    <p class="error-code" style="color: #7d0d0a;"> error </p>
    <div class="clear"></div>
    <div class="content">
        <p>( ⊙ o ⊙ )  前方高能！ <span>ÖÖÖ ${(error_msg)!''}</span></p>
        <br>
        <a class="index" href="/backend/index">┏ (゜ω゜)=☞ 撤回首页基地</a>
        <br>
        <a class="login" href="/backend/login">┏ (゜ω゜)=☞ 前往登陆基地试试</a>
    </div>

</body>
</html>
