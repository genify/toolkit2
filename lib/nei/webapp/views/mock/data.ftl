{% for data in mocks %}
<#-- {{data.description}} -->
<#assign {{data.name}} = {{data.value}}/>

{% endfor %}