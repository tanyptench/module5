'ordering flight to have non-empty search result
desiredDate = Month(Date+2) & "/" & Day(Date+2) & "/" & Year(Date+2)
flightNumber = orderFlight(DataTable("fromCity", dtLocalSheet), DataTable("toCity", dtLocalSheet), desiredDate, DataTable("Class", dtLocalSheet),DataTable("numOfTickets", dtLocalSheet), DataTable("username", dtLocalSheet))

'search booked flight
orders = searchFlight(DataTable("username", dtLocalSheet), desiredDate)
checkOrderFound orders, flightNumber

closeGUIApplication



