// bubblesort.s
// Sorts the string data into alphabetical order according to the ascii table.
// What happens if you try to sort a mixed case string?

.data
string: 	.asciz 	"gdacbfe"    // try out other strings by changing the data
worst: 	.asciz 	"gfedcba"
best: 	.asciz 	"abcdefg"

.extern puts

.text
// calculate string length to pass to bubble sort
strlen:
	ldrb r1, [r0]
	mov r2, #0
	
	strlen_loop:
		cmp r1, #0
		addne r2, r2, #1
		ldrbne r1, [r0, #1]!
		bne strlen_loop
	
	mov r0, r2			
	bx lr


// string bubble sort implementation
// arguments
//		r0 -> pointer to first char in string
//		r1 -> integer length of string
bsort:
	push {r4, r5, r6, r7, r12, lr}
 	
	bsort_next:
		mov r2, #0						// current element index
		mov r6, #0						// counter for number of swaps
	    
		bsort_loop:
			add r3, r2, #1				// next element index
			cmp r3, r1					// compare next element index to strlen
			bge bsort_check
      
			ldrb r4, [r0, r2] 		// load current byte
			ldrb r5, [r0, r3]			// load next byte
			cmp r4, r5					// compare bytes
      
			strbgt r5, [r0, r2]		// swap bytes if in wrong order
			strbgt r4, [r0, r3]		// ^
			addgt r6, r6, #1			// increment swap counter
      
			mov r2, r3					// set current index to next
			b bsort_loop				// loop!
			
	bsort_check:
		add r7, r7, r6
		cmp r6, #0						// were there any swaps this loop?
		subgt r1, r1, #1				// if there where the top element is sorted
		bgt bsort_next					//	if there were go back and bubble again
    
bsort_done:
	// pop link register directly into program counter
	// avoids additional branch instruction
	pop {r4, r5, r6, r7, r12, pc}
    

main:
	push {r12, lr}

	// load string
	ldr r0, =string

	// save string pointer outside of scratch registers
	mov r4, r0

	// find string length
	bl strlen

	// pass pointer and string length to sort algorithm
	mov r1, r0
	mov r0, r4
	bl bsort

	// reset pointer to first character
	mov r0, r4
	bl puts

	// pop and end
	pop {r12, lr}
	bx lr