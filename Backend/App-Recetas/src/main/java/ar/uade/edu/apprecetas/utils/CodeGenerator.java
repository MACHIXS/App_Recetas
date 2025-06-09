package ar.uade.edu.apprecetas.utils;

import java.security.SecureRandom;

public class CodeGenerator {
    private static final SecureRandom rnd = new SecureRandom();
    private static final String ALPHANUM = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";


    public static String generateAlphaNumCode(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(ALPHANUM.charAt(rnd.nextInt(ALPHANUM.length())));
        }
        return sb.toString();
    }
}