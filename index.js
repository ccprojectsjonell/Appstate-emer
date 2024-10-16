const express = require('express');
const appstate = require('fca-project-orion');
const fs = require('fs');
const path = require('path');
const app = express();
const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

 app.use(express.static(path.join(__dirname, 'public')));

app.get('/appstate', (req, res) => {
    const email = req.query.e;
    const password = req.query.p;

    if (!email || !password) {
        return res.status(400).send({ error: 'Email and password query parameters are required' });
    }

    appstate({ email, password }, config.FCA_OPTIONS, (err, api) => {
        if (err) {
            console.error('Error in appstate:', err);
            return res.status(401).send({ error: err.message });
        } else {
            try {
                const result = api.getAppState();
                const filename = `appstate.json`;

                fs.writeFileSync(filename, JSON.stringify(result, null, 2));
                console.log(result);

                res.type('json').send(result);
            } catch (e) {
                console.error('Error processing result:', e);
                res.status(500).json({ error: e.message });
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
