Feature: Basic test for correctness
# date format is MM/dd/yyyy

    Testing for correctness
    Scenario: Orders on a Tuesday
        Given I go to order page
        # a Tuesday
        And System has "2" orders on "12/14/2021" at "10:30"
        When User checks delivery times for "12/14/2021"
        Then System will show "12:30" and "18:30" delivery times
        And System will not show "10:30" delivery time

    Scenario: Orders on a Monday
        Given I go to order page
        # a Monday
        Given System has "3" orders on "12/13/2021" at "12:30"
        And System has "4" orders on "12/13/2021" at "18:30"
        When User checks delivery times for "12/13/2021"
        Then System will show "10:30" and "12:30" delivery times
        And System will not show "18:30" delivery time


    Scenario: No orders on a weekday
        Given I go to order page
        Given System has no orders for "12/23/2021"
        When User checks delivery times for "12/23/2021"
        Then System will show "10:30" and "12:30" and "18:30" delivery times


