const successful = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            background-color: white;
            font-family: Roboto;
        }

        h1 {
            color: #121212;
        }

        p {
            color: green;
        }

        .main {
            margin-left: auto;
            margin-right: auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
    </style>
</head>
<body>
    <div class="main">
        <h1>Successful</h1>
        <p>Your account upgradation was successful</p>
    </div>
</body>
</html>

`
const failed = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            background-color: white;
            font-family: Roboto;
        }

        h1 {
            color: #121212;
        }

        p {
            color: red;
        }

        .main {
            margin-left: auto;
            margin-right: auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
    </style>
</head>
<body>
    <div class="main">
        <h1>Failed</h1>
        <p>Your account upgradation failed</p>
    </div>
</body>
</html>

`

module.exports = {
    successful,
    failed
}