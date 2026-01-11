// recursion.s
// Count to 20 using a recursive function. 
// Watch the memory in the bottom right.

.text
bounded_recursion:
	// push lr to stack
	push {r12, lr}
	
	// set depth counter to 0
	mov r1, #0
	bl recurse
	
	// pop lr from stack and return
	pop {r12, lr}
	bx lr

recurse:
	// push lr to stack
	push {r12, lr}
	
	// increment argument 0 and call function
	add r1, r1, #1
	
	// check for base case (depth == n_iterations)
	cmp r1, r0
	blne recurse
	
	// pop lr from stack and return
	pop {r12, lr}
	bx lr

main:
	// push lr to stack
	push {r12, lr}
	
	// set arguments and call function
	mov r0, #20
	bl bounded_recursion
	
	// pop lr and branch to end
	pop {r12, lr}
	bx lr