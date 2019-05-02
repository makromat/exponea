# Exponea Assignment
## Integration Services Engineer
The goal of this assignment is to build a simple transformation service for online orders and refunds.
You will be using a simple Express JS template to build your own service. To launch the service template use

    node index.js

The service offers one route `/load`, which should return a transformed list of the orders. The current code opens a stream from a file with a list of the ordered items and pipes it as a response. Your goal is to modify the code to transform the list of ordered items to a list of orders.

The original file is in a delimiter-separated format using `|` as the delimiter. Each line contains a product that has been purchased/returned. It contains the following columns:
`email` - The email address of the person that has made the order
`order_id` - The ID of the order that the product was purchased within
`item_id` - The ID of the product
`price` - Price of the product
`action` - `order` or `refund` based on whether the product was purchased or returned

The output file should be in a comma-separated format. Each line should contain exactly one order/refund. It should contain the following columns:
`email_id` - Base64 encoded email address of the person that has made the order
`order_id` - The ID of the order
`items` - An array of the products that belong to the order, e.g. `[101, 427, 333]`
`total` - Sum of the prices of the items within the order. The value should be positive if the order was a `order` and negative if it was a `refund`

You can assume that all items belonging to the same order will follow each other within the original file.
Good Luck!