Like Token

    Method: POST
    URL: http://localhost:3000/api/tokens/:id/like
    URL Parameters:
        id: The token ID.

Buy Token

    Method: POST
    URL: http://localhost:3000/api/tokens/:id/buy
    URL Parameters:
        id: The token ID.

Sell Token

    Method: POST
    URL: http://localhost:3000/api/tokens/:id/sell
    URL Parameters:
        id: The token ID.

Supply Token

    Method: POST
    URL: http://localhost:3000/api/tokens/:id/supply
    URL Parameters:
        id: The token ID.

Get Token by ID

    Method: GET
    URL: http://localhost:3000/api/tokens/:id
    URL Parameters:
        id: The token ID.


Search Tokens

    Method: GET
    URL: http://localhost:3000/api/tokens
    Query Parameters:
        query: The search query.


#Updated API endpoints to return the following:
1.  Bonding Curve Price 
2.  Token Transaction Hash
3.  Initial supply and Current supply
4.  Market Cap
