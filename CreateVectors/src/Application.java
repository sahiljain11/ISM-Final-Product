import java.util.*;
import java.io.*;

public class Application {

    public static void main (String[] args) throws IOException{

	Scanner kb = new Scanner(new File("cleaned-dictionary.txt"));
	Scanner textReader = new Scanner(new File("cleaned-training-set.csv"));
	FileWriter writer = new FileWriter(new File("vectors.csv"));
	HashMap dictionary = new HashMap();

	while (kb.hasNext()) {
	    String[] inputSplitted = kb.nextLine().split(" ");
	    dictionary.put(inputSplitted[0], inputSplitted[1]);
	}
	
	while (textReader.hasNext()) {
	    String[] csvSplitted = textReader.nextLine().split("\t");

	    String[] messageSplitted = csvSplitted[1].split(" ");

	    String addString = csvSplitted[0];

	    for (int i = 0; i < messageSplitted.length; i++) {
			if (dictionary.containsKey(messageSplitted[i])) {
		    	addString += " " + dictionary.get(messageSplitted[i]);
			}
			else {
		    	addString += " 466551";
			}
	    }

		for (int i = 0; i < 100 - messageSplitted.length; i++) {
			addString += " 0";
		}

	    if (textReader.hasNext()) {
			writer.write(addString + "\r\n");
	    }
	    else {
			writer.write(addString);
	    }

	}

    }
    
}
