# NOTES

While researching different implementations of a bonded curve formula we found that nobody covers the case where the balance = 0.

## Current problem

Due to approximation errors, the current implementation can lead to the following:
- an actor is able to take a bit more than they should and the contract can get to a state where it cannot payout because of balance difference

## Useful resources:
-  https://stackoverflow.com/questions/2668248/how-to-find-a-binary-logarithm-very-fast-o1-at-best/30996072#30996072
  - uses the assumtion the integer is 64 bits.

## Conclusions:
- bancor formula (the one we try to replicate and use here) is for any polynomial which makes it a bit more complex that it should
- defining a square root formula with an integer coefficient will be trivial to implement
- same goes for a linear formula