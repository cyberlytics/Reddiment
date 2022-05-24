# Wireframe

[https://wireframe.cc/NUlNUR](https://wireframe.cc/NUlNUR)

# Data-Specification

### Suche Starten

`GET : Parameter: subredit=, (optional)tags=, (optional)t_period=`
<br>
#### Response
```
{
    mention: {
        x: [],
        y: [],
    },
    sentiment: {
        x: [],
        y: [],
    },
    current_sentiment: 0,
}
```


### Aktien-Suche

`GET : Parameter: share=`
<br>
#### Response
```
{
    share_history: {
        x: [],
        y: [],
    },
}
```



### Fehler bei Request

```
{
    error: 404,
    message: '',
}
```
