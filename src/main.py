word = input("Enter a word: ")
print(*(f"{char}: {ord(char)}" for char in word), sep="\n")
