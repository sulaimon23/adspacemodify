2019-10-22

1. Added "Optional to choose a city and Ad type"
2. Added price to locations
3. Added tags

CHANGE

1. Signup add Company (optional)
2. Add phone number (required)
3. Send email alert to their inbox for them to confirm
4. Profile for normal user
5. on signup add "mediaplanning" flag

Order page, add textfield for offering amout

Order:

```{
location: {},
user: {},
offeredAmount: 1000
}``

media planing , add filtering, with auto refresh,
add maybe 5% discount if threshold reached

Add top locations maybe 5 where rating >= 5,
sshow some dummy text to ffuck with them

Put categories before states on the home page query


for searchaeble select use combo box,
https://material-ui.com/components/autocomplete/

CHANGE LOG:
When user is logged in, dont show Sign up button

Changed states and cities select to searchable select


have hardocded location ids

20191120
1. Change fetching mechanism at website, only pull cities when they choose a state (Done, reduced by 50%)
2. Use uniformed search box at find your adspace
3. Add date range at booking page, and show Unavailable dates at location details (Done)
4. Add filters to the search result page
5. Combine location and booking pages (Done)
6. Create PDF for the user to send to their email when booking is done (when is it needed? when payment is done)
7. Add Profile page , to show their details, add reset password (forgot password is at login), (Done)
8. (forgot password) at Login Page (Done)
9. At booking page, show current available stock, so that wthen can book according to that (Done)
10. Start on MEDIA PLANNING (Done)
11. Add discounted price on locations (Done)
12. Work on templating the emails (Done)


20191123
1. change home layout as per shared link in yusuf's whatsapp (city should be there but can be empty) (Done)
2. At profile page, move recent orders above user edit card (Done)
3. Media planning, add subcategory, state and cities
4. Have quantity dropdown to choose quantity and add icon to choose (Done)
5. Remove price range (Done)
6. Add current total price as per selected locations (Done)
7. Add start and end date , should affect the locations fetched
8. Add filters at location page on top, try to make 4 columns (Done)
9. Add subject (dorpdown) at contact us form, yusuf will provide the content (Done ---HMMMMMM---)
10. Add popular cities, can hardcode this (Done)
11. At booking, multiply by quantity and monthly. (if radio or newspaper, have a radio, with Not applicable, and by that just use price * quantity) (Done)
12. Add order summary page after order has been done (Done)
13. Add image height and weight for the adspaces cards (Done)
14. Add image array at the adspace since we now have many images being uploaded (Done)
15. Show discounted price at location after being selected  (Done)
16. Add confirmation email || when status changes from pending to confirmed (Done)
17.

20191215
1. when logged in , change "ACCOUNT" TO USERS NAME, AND THEN CHANGE THEIR NAME TO ACCOUNT (Done)
2. Fix location images size (Done)
3. Advanced search (add multi tags, sub categories), show show when "Advaced Search"
button is clicked (Done)
4. At media planning, when they click Category, show the sub categories for that category (Added tags)
5. Fix similar locations (Done)
6. Add check for unavailable dates depending on start date at booking stage (Done)
7. Check confirmation email , not sending pdf
8. Add Completed status at profile (dONE)
```
