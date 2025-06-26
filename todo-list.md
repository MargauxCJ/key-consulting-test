# To-Do list

## initial commit

- import what I need for the development :
  - Angular Material
  - Jest (I prefere jest for unit test, so I have to remove Karma and Jasmine)

- Configure Jest (create jest config etc)
- Configure Angular Theme
- Clean up app.component

## Service, Models

- Create models for request: Town, Department & Region
- Create service for geo call
- Create the two components

## Region Search

- Use mat-autocomplete to list and select Region (be careful with observables, try to reduce call)
- Use mat-list or something like this, with selectable item to get departmentCode

## Department Details

- display this component in the region search and input departmentcode
- Use matDataSource for display list, use paginator and sort to add some feature

## Testing

- I wrote testing code just for the geoService and for the autocomplete input in region-search.
I add the router-outlet testing in app component. Could be useful if I'm doing some sub routing in page.

## Changes & Fix

- Create a geoStore to set the department selected, don't want to subscribe everytime in department-details to update towns.
- I made the deliberate choice to display the department-detail component inside the region-search component for user experience reasons.
If there had been more information, I would have displayed it on a dedicated page. I left a piece of code in the routing to show that I know how to do it,
but for the sake of usability, I preferred to keep it this way.
