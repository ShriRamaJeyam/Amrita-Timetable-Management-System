package edu.amrita.timetable;

public class Course 
{
	private int ID;
	private String Name;
	private String Code;
	private int Theory,Lab;
	public int getID() {
		return ID;
	}
	public void setID(int iD) {
		ID = iD;
	}
	public String getName() {
		return Name;
	}
	public void setName(String name) {
		Name = name;
	}
	public String getCode() {
		return Code;
	}
	public void setCode(String code) {
		Code = code;
	}
	public int getTheory() {
		return Theory;
	}
	public void setTheory(int theory) {
		Theory = theory;
	}
	public int getLab() {
		return Lab;
	}
	public void setLab(int lab) {
		Lab = lab;
	}
}
