package edu.amrita.timetable;
import java.util.ArrayList;
import java.util.List;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.drools.compiler.lang.dsl.DSLMapParser.statement_return;
@SuppressWarnings("unused")
public class LoadFromDB 
{
	public static void Load()
	{
		String ConnectionURL="jdbc:sqlserver://mssqldbase.database.windows.net:1433;database=TimeTable;user=timetable@mssqldbase;password=hfr2spicy!;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;";
		try (Connection connection = DriverManager.getConnection(ConnectionURL);) 
		{
		       //Faculty and FacultyGroup
		       {
		    	   Statement stmt=connection.createStatement();
		    	   String sqlquery="select * from faculty;";
		    	   ResultSet rs=stmt.executeQuery(sqlquery);
		    	   while (rs.next()) 
		    	   {
		    		    int ID=rs.getInt("FacultyID");
		    		    String Name=rs.getString("FacultyName");
		    		    Faculty fac=new Faculty();
		    		    fac.setID(ID);
		    		    fac.setName(Name);
		    		    MapClass.FacultyList.add(fac);
		    		    List<Faculty> lst=new ArrayList<Faculty>();
		    		    lst.add(fac);
		    		    MapClass.FacultyGroup.put(ID,lst);
		    	   }
		    	   rs.close();
		    	   stmt.close();
		    	   stmt=connection.createStatement();
		    	   sqlquery="select * from facultygroupmembers;";
		    	   rs=stmt.executeQuery(sqlquery);
		    	   while (rs.next()) 
		    	   {
		    		    int ID=rs.getInt("FacultyID");
		    		    int GID=rs.getInt("FacultyGroupID");
		    		    if(!MapClass.FacultyGroup.containsKey(GID))
		    		    {
		    		    	MapClass.FacultyGroup.put(GID,new ArrayList<Faculty>());
		    		    }
		    		    MapClass.FacultyGroup.get(GID).add(MapClass.FacultyGroup.get(ID).get(0));
		    	   }
		    	   rs.close();
		    	   stmt.close();
		       }
		       //Rooms and RoomGroup
		       {
		    	   Statement stmt=connection.createStatement();
		    	   String sqlquery="select * from room;";
		    	   ResultSet rs=stmt.executeQuery(sqlquery);
		    	   while (rs.next()) 
		    	   {
		    		    int ID=rs.getInt("RoomID");
		    		    String Name=rs.getString("RoomName");
		    		    int FloorNo=rs.getInt("FloorNo");
		    		    String Wing=rs.getString("Wing");
		    		    int RoomNo=rs.getInt("RoomNo");
		    		    int Region=rs.getInt("RegionID");
		    		    Room rm=new Room();
		    		    rm.setID(ID);
		    		    rm.setRegion(Region);
		    		    rm.setFloor(FloorNo);
		    		    rm.setWing(Wing);
		    		    rm.setRoomNo(RoomNo);
		    		    rm.setName(Name);
		    		    MapClass.RoomList.add(rm);
		    		    List<Room> lst=new ArrayList<Room>();
		    		    lst.add(rm);
		    		    MapClass.RoomGroup.put(ID,lst);
		    	   }
		    	   rs.close();
		    	   stmt.close();
		    	   stmt=connection.createStatement();
		    	   sqlquery="select * from roomgroupmembers;";
		    	   rs=stmt.executeQuery(sqlquery);
		    	   while (rs.next()) 
		    	   {
		    		    int ID=rs.getInt("RoomID");
		    		    int GID=rs.getInt("RoomGroupID");
		    		    if(!MapClass.RoomGroup.containsKey(GID))
		    		    {
		    		    	MapClass.RoomGroup.put(GID,new ArrayList<Room>());
		    		    }
		    		    MapClass.RoomGroup.get(GID).add(MapClass.RoomGroup.get(ID).get(0));
		    	   }
		    	   
		       }
		       //DayList and DayList
		       {
		    	   Statement stmt=connection.createStatement();
		    	   String sqlquery="select * from daylist;";
		    	   ResultSet rs=stmt.executeQuery(sqlquery);
		    	   while (rs.next()) 
		    	   {
		    		    int ID=rs.getInt("DayListID");
		    		    String Name=rs.getString("DayListName");
		    		    WeekDay day=new WeekDay();
		    		    day.setID(ID);
		    		    day.setDescription(Name);
		    		    MapClass.WeekDayList.add(day);
		    		    List<WeekDay> lst=new ArrayList<WeekDay>();
		    		    lst.add(day);
		    		    MapClass.WeekDayGroup.put(ID,lst);
		    	   }
		    	   rs.close();
		    	   stmt.close();
		    	   stmt=connection.createStatement();
		    	   sqlquery="select * from DayListgroupmembers;";
		    	   rs=stmt.executeQuery(sqlquery);
		    	   while (rs.next()) 
		    	   {
		    		    int ID=rs.getInt("DaylistID");
		    		    int GID=rs.getInt("DaylistGroupID");
		    		    if(!MapClass.WeekDayGroup.containsKey(GID))
		    		    {
		    		    	MapClass.WeekDayGroup.put(GID,new ArrayList<WeekDay>());
		    		    }
		    		    MapClass.WeekDayGroup.get(GID).add(MapClass.WeekDayGroup.get(ID).get(0));
		    	   }
		    	   //System.out.println(MapClass.WeekDayGroup);
		    	   //System.out.println(MapClass.WeekDayList);
		       }
		       //TimeSlot and TimeSlotGroup
		       {
		    	   Statement stmt=connection.createStatement();
		    	   String sqlquery="select * from TimeSlot;";
		    	   ResultSet rs=stmt.executeQuery(sqlquery);
		    	   while (rs.next()) 
		    	   {
		    		   	TimeSlot slt=new TimeSlot();
		    		   	slt.setID(rs.getInt("TimeSlotID"));
		    		   	slt.setStart(rs.getInt("Starter"));
		    		   	slt.setEnd(rs.getInt("Ender"));
		    		   	if(rs.getInt("extended")==1)
		    		   	{
		    		   		slt.setExtended(true);
		    		   		slt.setEstart(rs.getInt("ExtendedStarter"));
		    		   		slt.setEend(rs.getInt("ExtendedEnder"));
		    		   	}
		    		    MapClass.TimeSlotList.add(slt);
		    		    List<TimeSlot> lst=new ArrayList<TimeSlot>();
		    		    lst.add(slt);
		    		    MapClass.TimeSlotGroup.put(rs.getInt("TimeSlotID"),lst);
		    	   }
		    	   rs.close();
		    	   stmt.close();
		    	   stmt=connection.createStatement();
		    	   sqlquery="select * from TimeSlotgroupmembers;";
		    	   rs=stmt.executeQuery(sqlquery);
		    	   while (rs.next()) 
		    	   {
		    		    int ID=rs.getInt("TimeSlotID");
		    		    int GID=rs.getInt("TimeSlotGroupID");
		    		    if(!MapClass.TimeSlotGroup.containsKey(GID))
		    		    {
		    		    	MapClass.TimeSlotGroup.put(GID,new ArrayList<TimeSlot>());
		    		    }
		    		    MapClass.TimeSlotGroup.get(GID).add(MapClass.TimeSlotGroup.get(ID).get(0));
		    	   }
		    	   //System.out.println(MapClass.TimeSlotGroup);
		    	   //System.out.println(MapClass.TimeSlotList);
		       }
		       //Lectures
		       {
		    	   Statement stmt=connection.createStatement();
		    	   String sqlquery="select * from Lectures;";
		    	   ResultSet rs=stmt.executeQuery(sqlquery);
		    	   while (rs.next()) 
		    	   {
		    		   Lecture lec=new Lecture();
		    		   lec.setID(rs.getInt("LectureID"));
		    		   lec.setRegistration(rs.getInt("Registration"));
		    		   lec.setRoomSrc(rs.getInt("RoomID"));
		    		   lec.setTimeSlotSrc(rs.getInt("TimeSlotID"));
		    		   lec.setWeekDaySrc(rs.getInt("DayListID"));
		    		   MapClass.LectureList.add(lec);
		    	   }
		    	   rs.close();
		    	   stmt.close();
		    	   //System.out.println(MapClass.LectureList);
		       }
		       //Registration
		       {
		    	   Statement stmt=connection.createStatement();
		    	   String sqlquery="select * from Registration;";
		    	   ResultSet rs=stmt.executeQuery(sqlquery);
		    	   while (rs.next()) 
		    	   {
		    		   MapClass.RegToCurr.put(rs.getInt("RegistrationID"), rs.getInt("CurriculumID"));
		    		   MapClass.RegToFac.put(rs.getInt("RegistrationID"), rs.getInt("Faculty"));
		    	   }
		    	   rs.close();
		    	   stmt.close();
		    	   //System.out.println(MapClass.RegToCurr);
		    	   //System.out.println(MapClass.RegToFac);
		       }
		       System.out.println("Success");
		       connection.close();
		}
		catch (SQLException e) 
		{
		       e.printStackTrace();
		}
	}
}
