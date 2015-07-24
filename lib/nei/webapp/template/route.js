var util = require('./util.js');

module.exports = {
    {%- for rule in rules %}
    "{{rule.method|default('GET')}} {{rule.path}}":util.filter({{rule.id}},'{{rule.mock}}'){% if !loop.last %},{% endif %}
    {%- endfor %}
};
