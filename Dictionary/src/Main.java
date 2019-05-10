import java.util.*;
import java.io.*;

public class Main {

    public static void main (String[] args) throws IOException {

        Scanner kb = new Scanner(new File("dictionary.txt"));
	    FileWriter fileWriter = new FileWriter(new File("cleaned-dictionary.txt"));

	int x = 0;
	
	while (kb.hasNext()) {
	    String input = kb.nextLine().toLowerCase();
	    if (!kb.hasNext()) {
			fileWriter.write(input + " " + x);
		}
		else {
			fileWriter.write(input + " " + x + "\r\n");
		}
		x++;
	}

	fileWriter.close();

    }

}
