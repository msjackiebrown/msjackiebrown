## How to Setup a Flask Application (Example)

```python
from flask import Flask, render_template
app = Flask(__name__)

@app.route("/")

def homepage():

    user_name = "Anderson"

    items = ["Apple", "Banana", "Cherry"]

    return render_template("homepage.html", username=user_name, items=items) 

if __name__ == "__main__":

    app.run(debug=True)
```

```html
<!DOCTYPE html>

<html>

<head>

    <title>My Flask Homepage</title>

</head>

<body>

    <h1>Welcome, {{ username }}!</h1>

</body>

</html>

  

----------------------------

<!DOCTYPE html>

<html>

<head>

    <title>My Flask Homepage</title>

</head>

<body>

    <h1>Hello!</h1>

    {% if username %}

        <p>We’re happy to have you here, {{ username }}.</p>

    {% else %}

        <p>Welcome, guest!</p>

    {% endif %}

  

    <h2>Here is the list of items:</h2>

    <ul>

        {% for item in items %}

            <li>{{ item }}</li>

        {% endfor %}

    </ul>

  

</body>

</html>
```