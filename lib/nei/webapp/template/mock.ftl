{% for data in mocks %}
<#-- {% if data.array %}Array.{% endif %}{{data.type}} : {{data.description}} -->
<#assign {{data.name}} = {{data.value}}/>

{% endfor %}
