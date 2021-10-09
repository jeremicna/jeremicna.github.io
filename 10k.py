series_prefix = input("Series Prefix:")
serials = []

for index in range(0, 10000):
    serials.append(str(index))

file = open("output.txt", "w")
file.write(" ".join(serials))

